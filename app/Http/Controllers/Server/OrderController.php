<?php

namespace App\Http\Controllers\Server;

use App\Models\Order;
use App\Models\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('customer')
            ->when($request->search, function($q) use ($request) {
                $search = $request->search;
                $q->whereHas('customer', function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy(
                $request->sortField ?? 'created_at',
                $request->sortOrder == -1 ? 'desc' : 'asc'
            );

        if (auth()->user()->role === 'user') {
            $query->select(['id', 'customer_id', 'status', 'total_price', 'created_at']);
        }

        $orders = $query->paginate(10)->appends($request->query());

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
            'auth' => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'status'      => 'required|string|max:50',
            'total_price' => 'required|numeric|min:0',
        ]);

        $order = Order::create([
            'customer_id' => $request->customer_id,
            'status'      => $request->status,
            'total_price' => $request->total_price,
        ]);

        LogService::log(
            'create_order',
            "Created order #{$order->id}",
            null,
            $order
        );

        return redirect()->route('orders.index')->with('success', 'Order created successfully.');
    }

    public function edit(Order $order)
    {
        return Inertia::render('Orders/Edit', [
            'order'     => $order,
            'customers' => Customer::select('id', 'name')->get(),
            // thêm các mảng khác nếu Edit page có dùng
        ]);
    }


    // Update chỉ status
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $old = $order->getOriginal(); // lưu trạng thái cũ
        $order->update(['status' => $request->status]); // update status

        // Tạo JSON chi tiết thay đổi, y hệt CategoryController
        $changes = [];
        foreach ($order->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log(
            'update_order',
            "Updated order #{$order->id} status",
            null,
            $order,
            $changes
        );

        return redirect()->route('orders.index')->with('success', 'Order status updated successfully.');
    }

    // Xóa order
    public function destroy(Order $order)
    {
        $name = "Order #{$order->id}";
        $order->delete();

        LogService::log(
            'delete_order',
            "Deleted {$name}",
            null,
            $order
        );

        return redirect()->back()->with('success', 'Order deleted.');
    }

    // Xem chi tiết order
    public function show(Order $order)
    {
        $order->load(['customer', 'items.product']);

        $items = $order->items->map(function ($item) {
            return [
                'id'        => $item->id,
                'name'      => $item->product->name ?? 'Unknown',
                'price'     => (float) $item->price,
                'quantity'  => (int) $item->quantity,
                'image_url' => $item->product->default_image
                                ? '/' . ltrim($item->product->default_image, '/')
                                : null,
            ];
        });

        return Inertia::render('Orders/Show', [
            'order' => $order->only(['id', 'status', 'total_price', 'created_at']),
            'customer' => [
                'id'      => $order->customer->id,
                'name'    => $order->customer->name,
                'email'   => $order->customer->email,
                'phone'   => $order->customer->phone,
                'address' => $order->customer->address,
            ],
            'items' => $items,
            'auth' => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }
}
