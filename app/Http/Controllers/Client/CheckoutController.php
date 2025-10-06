<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $customerId = Auth::guard('customer')->id();
        $cart = Cart::with('items.product')
            ->where('customer_id', $customerId)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Client/CheckoutPage', [
            'cart' => $cart,
            'customer' => Auth::guard('customer')->user(),
            'csrfToken' => csrf_token(),
        ]);
    }

    public function confirm(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:1000',
        ]);

        $customerId = Auth::guard('customer')->id();
        $cart = Cart::with('items.product')
            ->where('customer_id', $customerId)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $totalPrice = $cart->items->sum(fn($item) => $item->quantity * $item->product->price);

        return Inertia::render('Client/ConfirmCheckoutPage', [
            'cart' => $cart,
            'customer' => $data,
            'total' => $totalPrice,
            'csrfToken' => csrf_token(),
        ]);
    }

    public function placeOrder(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:1000',
        ]);

        $customerId = Auth::guard('customer')->id();
        $cart = Cart::with('items.product')
            ->where('customer_id', $customerId)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        try {
            DB::transaction(function () use ($cart, $data, $customerId) {

                foreach ($cart->items as $item) {
                    $storeInventory = StoreInventory::where('store_id', 1)
                        ->where('product_id', $item->product_id)
                        ->lockForUpdate()
                        ->first();

                    if (!$storeInventory) {
                        throw new \Exception("Store #1 does not have product {$item->product->name} in inventory.");
                    }

                    if ($item->quantity > $storeInventory->quantity) {
                        throw new \Exception("Not enough stock for product {$item->product->name} in Store #1 (only {$storeInventory->quantity} left).");
                    }
                }

                $totalPrice = $cart->items->sum(fn($item) => $item->quantity * $item->product->price);

                $order = Order::create([
                    'customer_id' => $customerId,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                    'status' => 'pending',
                    'total_price' => $totalPrice,
                ]);

                foreach ($cart->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price,
                    ]);

                    // Trừ tồn kho ở store_id = 1
                    $storeInventory = StoreInventory::where('store_id', 1)
                        ->where('product_id', $item->product_id)
                        ->lockForUpdate()
                        ->first();

                    $storeInventory->decrement('quantity', $item->quantity);
                }

                $cart->items()->delete();
                $cart->delete();
            });
        } catch (\Exception $e) {
            return redirect()->route('cart.index')->with('error', $e->getMessage());
        }

        return redirect()->route('client.dashboard')->with('success', 'Your order has been placed!');
    }

}
