<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;

class OrderPageController extends Controller
{
    public function index()
    {
        $customerId = Auth::guard('customer')->id();

        $orders = Order::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total' => $order->total_price,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Client/OrderIndex', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Forbidden');
        }

        // Lấy review chỉ của đơn này (order hiện tại)
        $order->load(['items.product.reviews' => function ($q) use ($order) {
            $q->where('user_id', Auth::guard('customer')->id())
              ->where('order_id', $order->id);
        }]);

        $orderDetails = [
            'id' => $order->id,
            'status' => $order->status,
            'customer' => [
                'name' => $order->name,
                'email' => $order->email,
                'phone' => $order->phone,
                'address' => $order->address,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'default_image' => $item->product->default_image,
                        'reviews' => $item->product->reviews,
                    ],
                    'quantity' => $item->quantity,
                ];
            }),
            'total' => $order->total_price,
        ];

        return Inertia::render('Client/OrderShow', [
            'order' => $orderDetails,
        ]);
    }

    public function cancel(Order $order)
    {
        if ($order->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Forbidden');
        }

        if (in_array($order->status, ['completed', 'cancelled'])) {
            return redirect()->back()->with('error', 'Cannot cancel this order.');
        }

        \DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $inventory = \App\Models\StoreInventory::where('store_id', 1)
                    ->where('product_id', $item->product_id)
                    ->first();

                if ($inventory) {
                    $inventory->increment('quantity', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);
        });

        return redirect()->back()->with('success', 'Order cancelled and inventory updated.');
    }


    public function confirm(Order $order)
    {
        if ($order->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Forbidden');
        }

        if (!in_array($order->status, ['pending', 'processing'])) {
            return redirect()->back()->with('error', 'Order cannot be confirmed.');
        }

        $order->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Order confirmed successfully.');
    }

    public function review(Request $request, Order $order, Product $product)
    {
        if ($order->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Forbidden');
        }

        if ($order->status !== 'completed') {
            return redirect()->back()->with('error', 'Only completed orders can be reviewed.');
        }

        $hasProduct = $order->items()->where('product_id', $product->id)->exists();
        if (!$hasProduct) {
            return redirect()->back()->with('error', 'This product is not in your order.');
        }

        $alreadyReviewed = Review::where('user_id', Auth::guard('customer')->id())
            ->where('order_id', $order->id)
            ->where('product_id', $product->id)
            ->exists();

        if ($alreadyReviewed) {
            return redirect()->back()->with('error', 'You have already reviewed this product in this order.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::create([
            'user_id'    => Auth::guard('customer')->id(),
            'order_id'   => $order->id,
            'product_id' => $product->id,
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Review submitted successfully.');
    }
}
