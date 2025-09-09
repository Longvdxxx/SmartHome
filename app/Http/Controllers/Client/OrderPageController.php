<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class OrderPageController extends Controller
{
    /**
     * Show list of customer's orders
     */
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

    /**
     * Show order details
     */
    public function show(Order $order)
    {
        // Chỉ cho phép khách hàng xem đơn của mình
        if ($order->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Forbidden');
        }

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
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'default_image' => $item->product->default_image,
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

        $order->update(['status' => 'Cancelled']);

        return redirect()->back()->with('success', 'Order cancelled successfully.');
    }
}
