<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\StoreInventory;
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

            // Lấy tồn kho của store_id = 1
            $storeStock = StoreInventory::where('store_id', 1)
                ->where('product_id', $item->product->id)
                ->value('quantity') ?? 0;

            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image_url' => $imageUrl,
                    'store_stock' => $storeStock,
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
        // Lấy tồn kho của store_id = 1
        $storeInventory = StoreInventory::where('store_id', 1)
            ->where('product_id', $product->id)
            ->first();

        if (!$storeInventory || $storeInventory->quantity <= 0) {
            return redirect()->back()->with('error', 'This product is out of stock in Store #1.');
        }

        $cart = Cart::firstOrCreate([
            'customer_id' => Auth::guard('customer')->id()
        ]);

        $item = $cart->items()->where('product_id', $product->id)->first();
        $quantity = $request->input('quantity', 1);

        // Nếu vượt quá số lượng trong store
        $newQuantity = ($item ? $item->quantity : 0) + $quantity;
        if ($newQuantity > $storeInventory->quantity) {
            return redirect()->back()->with('error', "Only {$storeInventory->quantity} left in stock for {$product->name}.");
        }

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Product added to cart.');
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

        // Lấy tồn kho của store_id = 1
        $storeInventory = StoreInventory::where('store_id', 1)
            ->where('product_id', $item->product->id)
            ->first();

        if (!$storeInventory) {
            return redirect()->back()->with('error', "Store #1 does not have {$item->product->name}.");
        }

        if ($quantity > $storeInventory->quantity) {
            return redirect()->back()->with('error', "{$item->product->name} has only {$storeInventory->quantity} left in Store #1.");
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
