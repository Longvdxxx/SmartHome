<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\StoreInventory;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmployeeOrderController extends Controller
{
    public function index()
    {
        $employee = Auth::guard('employee')->user();
        $storeId = $employee->store_id;

        $orders = Order::where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                $daysSinceCreated = Carbon::now()->diffInDays($order->created_at);
                return [
                    'id' => $order->id,
                    'status' => ucfirst($order->status),
                    'total' => $order->total_price,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                    'can_cancel' => $daysSinceCreated <= 7, // Có thể hủy tất cả trong 7 ngày
                ];
            });

        return Inertia::render('Staff/OrderIndex', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $employee = Auth::guard('employee')->user();
        if ($order->store_id !== $employee->store_id) {
            abort(403, 'Forbidden');
        }

        $orderDetails = [
            'id' => $order->id,
            'status' => ucfirst($order->status),
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
                    ],
                    'quantity' => $item->quantity,
                ];
            }),
            'total' => $order->total_price,
            'can_cancel' => Carbon::now()->diffInDays($order->created_at) <= 7,
        ];

        return Inertia::render('Staff/OrderShow', [
            'order' => $orderDetails,
        ]);
    }

    public function cancel(Order $order)
    {
        $employee = Auth::guard('employee')->user();
        if ($order->store_id !== $employee->store_id) {
            abort(403, 'Forbidden');
        }

        if (Carbon::now()->diffInDays($order->created_at) > 7) {
            return redirect()->back()->with('error', 'Order can only be cancelled within 7 days.');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $inventory = StoreInventory::where('store_id', $order->store_id)
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
        $employee = Auth::guard('employee')->user();
        if ($order->store_id !== $employee->store_id) {
            abort(403, 'Forbidden');
        }

        if ($order->status === 'completed') {
            return redirect()->back()->with('error', 'Order is already completed.');
        }

        $order->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Order confirmed as completed.');
    }
}
