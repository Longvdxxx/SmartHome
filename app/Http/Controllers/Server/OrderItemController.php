<?php

namespace App\Http\Controllers\Server;

use App\Models\OrderItem;
use App\Models\Order;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        OrderItem::create($request->only('order_id', 'product_id', 'quantity', 'price'));

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

        $orderItem->update($request->only('order_id', 'product_id', 'quantity', 'price'));

        return redirect()->route('order-items.index')->with('success', 'Order item updated successfully.');
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();
        return redirect()->back()->with('success', 'Order item deleted.');
    }
}
