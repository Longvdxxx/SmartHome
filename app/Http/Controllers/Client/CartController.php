<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::firstOrCreate([
            'customer_id' => Auth::guard('customer')->id()
        ]);

        $cart->load('items.product');

        $items = $cart->items->map(function ($item) {
            $imageUrl = $item->product->default_image
                ? '/' . ltrim($item->product->default_image, '/')
                : '/placeholder.png';

            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image_url' => $imageUrl,
                ],
            ];
        });

        return Inertia::render('Client/Cart', [
            'cart' => [
                'id' => $cart->id,
                'items' => $items,
            ]
        ]);
    }

    public function add(Request $request, Product $product)
    {
        if ($product->stock <= 0) {
            return redirect()->back()->with('error', 'This product is out of stock.');
        }

        $cart = Cart::firstOrCreate([
            'customer_id' => Auth::guard('customer')->id()
        ]);

        $item = $cart->items()->where('product_id', $product->id)->first();
        $quantity = $request->input('quantity', 1);

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Added to cart successfully.');
    }

    public function update($id, $quantity)
    {
        $item = CartItem::with('product', 'cart')->findOrFail($id);

        $currentCustomerId = Auth::guard('customer')->id();
        if (!$item->cart || $item->cart->customer_id !== $currentCustomerId) {
            abort(403, 'Unauthorized action.');
        }

        $quantity = intval($quantity);
        if ($quantity < 1) {
            $quantity = 1;
        }

        if ($quantity > $item->product->stock) {
            return redirect()->back()->with('error', "{$item->product->name} is only has {$item->product->stock} left.");
        }

        $item->quantity = $quantity;
        $item->save();

        return redirect()->back()->with('success', 'Cart updated successfully.');
    }


    public function remove(CartItem $item)
    {
        $item->delete();

        return redirect()->back()->with('success', 'Item removed successfully.');
    }
}
