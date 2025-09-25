<?php

namespace App\Http\Controllers\Server;

use App\Models\Order;
use App\Models\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('customer')
            ->when($request->search, function($q) {
                $q->whereHas('customer', function($sub) {
                    $sub->where('name', 'like', '%' . request('search') . '%');
                });
            })
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        if (auth()->user()->role === 'user') {
            $query->select(['id', 'customer_id', 'status', 'total_price', 'created_at']);
        }

        $orders = $query->paginate(10)->appends(request()->query());

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
            'name'        => 'nullable|string|max:255',
            'email'       => 'nullable|email|max:255',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
        ]);

        Order::create([
            'customer_id' => $request->customer_id,
            'status'      => $request->status,
            'total_price' => $request->total_price,
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'address'     => $request->address,
        ]);

        return redirect()->route('orders.index')->with('success', 'Order created successfully.');
    }

    public function edit(Order $order)
    {
        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'customers' => Customer::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'status'      => 'required|string|max:50',
            'total_price' => 'required|numeric|min:0',
            'name'        => 'nullable|string|max:255',
            'email'       => 'nullable|email|max:255',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
        ]);

        $order->update([
            'customer_id' => $request->customer_id,
            'status'      => $request->status,
            'total_price' => $request->total_price,
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'address'     => $request->address,
        ]);

        return redirect()->route('orders.index')->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Order deleted.');
    }

    public function show(Order $order)
    {
        $order->load([
            'customer',
            'items.product'
        ]);

        $items = $order->items->map(function ($item) {
            return [
                'id'       => $item->id,
                'name'     => $item->product->name ?? 'Unknown',
                'price'    => (float) $item->price,
                'quantity' => (int) $item->quantity,
                'image_url'=> $item->product->default_image
                                ? '/' . ltrim($item->product->default_image, '/')
                                : null,
            ];
        });

        return Inertia::render('Orders/Show', [
            'order'    => $order->only(['id', 'status', 'total_price', 'created_at']),
            'customer' => [
                'id'      => $order->customer->id,
                'name'    => $order->name,
                'email'   => $order->email,
                'phone'   => $order->phone,
                'address' => $order->address,
            ],
            'items'    => $items,
            'auth'     => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }
}
