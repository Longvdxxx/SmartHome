<?php

namespace App\Http\Controllers\Server;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogService;

class OrderItemController extends Controller
{
    public function index(Request $request)
    {
        $query = OrderItem::with(['order', 'product'])
            ->when($request->search, function($q) {
                $search = request('search');
                $q->whereHas('order', function($sub) use ($search) {
                    $sub->where('id', 'like', "%{$search}%");
                })->orWhereHas('product', function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        $orderItems = $query->paginate(10)->appends(request()->query());

        return Inertia::render('OrderItems/Index', [
            'orderItems' => $orderItems,
            'filters'    => $request->only('search', 'sortField', 'sortOrder'),
            'auth'       => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('OrderItems/Create', [
            'orders'   => Order::select('id')->get(),
            'products' => Product::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id'   => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'price'      => 'required|numeric|min:0'
        ]);

        $orderItem = OrderItem::create($request->only('order_id', 'product_id', 'quantity', 'price'));

        // LogService create
        LogService::log(
            'create_order_item',
            "Created order item #{$orderItem->id}",
            null,
            $orderItem
        );

        return redirect()->route('order-items.index')->with('success', 'Order item created successfully.');
    }

    public function edit(OrderItem $orderItem)
    {
        return Inertia::render('OrderItems/Edit', [
            'orderItem' => $orderItem,
            'orders'    => Order::select('id')->get(),
            'products'  => Product::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'order_id'   => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'price'      => 'required|numeric|min:0'
        ]);

        $old = $orderItem->getOriginal(); // lưu dữ liệu cũ
        $orderItem->update($request->only('order_id', 'product_id', 'quantity', 'price'));

        // Log JSON chi tiết thay đổi
        $changes = [];
        foreach ($orderItem->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        // LogService update
        LogService::log(
            'update_order_item',
            "Updated order item #{$orderItem->id}",
            null,
            $orderItem,
            $changes
        );

        return redirect()->route('order-items.index')->with('success', 'Order item updated successfully.');
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();

        // LogService delete
        LogService::log(
            'delete_order_item',
            "Deleted order item #{$orderItem->id}",
            null,
            $orderItem
        );

        return redirect()->back()->with('success', 'Order item deleted.');
    }
}
