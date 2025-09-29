<?php

namespace App\Http\Controllers\Server;

use App\Models\Product;
use App\Models\ProductImage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\LogService;

class ProductImageController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductImage::with(['product.category', 'product.brand'])->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('search')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $images = $query->paginate(10)->appends($request->all());

        $products = Product::orderBy('name')->get(['id', 'name']);

        return Inertia::render('ProductImages/Index', [
            'images'   => $images,
            'products' => $products,
            'filters'  => $request->only(['search', 'product_id', 'sortField', 'sortOrder']),
        ]);
    }

    public function create()
    {
        $products = Product::with(['category', 'brand'])
            ->orderBy('name')
            ->get(['id', 'name', 'category_id', 'brand_id']);

        return Inertia::render('ProductImages/Create', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'required|image|max:20480',
        ]);

        $path = $request->file('image')->store('product_images', 'public');

        $productImage = ProductImage::create([
            'product_id' => $request->product_id,
            'url'        => 'storage/' . $path
        ]);

        LogService::log('create_product_image', "Created image #{$productImage->id} for product #{$productImage->product_id}", null, $productImage);

        return redirect()->route('product-images.index', $request->product_id)
            ->with('success', 'Image uploaded successfully.');
    }

    public function edit(ProductImage $productImage)
    {
        $products = Product::with(['category', 'brand'])
            ->orderBy('name')
            ->get(['id', 'name', 'category_id', 'brand_id']);

        return Inertia::render('ProductImages/Edit', [
            'productImage' => $productImage->load('product'),
            'products' => $products
        ]);
    }

    public function update(Request $request, ProductImage $productImage)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'nullable|image|max:20480',
        ]);

        $old = $productImage->getOriginal();

        if ($request->product_id != $productImage->product_id) {
            $productImage->update(['product_id' => $request->product_id]);
        }

        if ($request->hasFile('image')) {
            if ($productImage->url && Storage::exists(str_replace('storage/', 'public/', $productImage->url))) {
                Storage::delete(str_replace('storage/', 'public/', $productImage->url));
            }

            $path = $request->file('image')->store('product_images', 'public');

            $productImage->update(['url' => 'storage/' . $path]);
        }

        $changes = [];
        foreach ($productImage->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_product_image', "Updated image #{$productImage->id}", null, $productImage, $changes);

        return redirect()->route('product-images.index', $productImage->product_id)
            ->with('success', 'Image updated successfully.');
    }

    public function destroy(ProductImage $productImage)
    {
        $productId = $productImage->product_id;

        if ($productImage->url && Storage::exists(str_replace('storage/', 'public/', $productImage->url))) {
            Storage::delete(str_replace('storage/', 'public/', $productImage->url));
        }

        $productImage->delete();

        LogService::log('delete_product_image', "Deleted image #{$productImage->id} for product #{$productId}", null, $productImage);

        return redirect()->route('product-images.index', $productId)
            ->with('success', 'Image deleted successfully.');
    }
}
