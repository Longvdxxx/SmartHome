<?php

namespace App\Http\Controllers\Server;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\LogService;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])
            ->when($request->search, function($q) {
                $q->where('name', 'like', '%' . request('search') . '%')
                  ->orWhereHas('category', function($sub) {
                      $sub->where('name', 'like', '%' . request('search') . '%');
                  })
                  ->orWhereHas('brand', function($sub) {
                      $sub->where('name', 'like', '%' . request('search') . '%');
                  });
            })
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        $products = $query->paginate(10)->appends(request()->query());

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters'  => $request->only('search', 'sortField', 'sortOrder'),
            'auth'     => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'brand_id'      => 'nullable|exists:brands,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'default_image' => 'nullable|image|max:20480',
        ]);

        $data = $request->only('category_id', 'brand_id', 'name', 'description', 'price', 'stock');

        if ($request->hasFile('default_image')) {
            $path = $request->file('default_image')->store('products', 'public');
            $data['default_image'] = 'storage/' . $path;
        }

        $product = Product::create($data);

        LogService::log('create_product', "Created product: {$product->name}", null, $product);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product'    => $product,
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'brand_id'      => 'nullable|exists:brands,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'default_image' => 'nullable|image|max:20480',
        ]);

        $data = $request->only('category_id', 'brand_id', 'name', 'description', 'price', 'stock');

        if ($request->hasFile('default_image')) {
            if ($product->default_image && Storage::exists(str_replace('storage/', 'public/', $product->default_image))) {
                Storage::delete(str_replace('storage/', 'public/', $product->default_image));
            }

            $path = $request->file('default_image')->store('products', 'public');
            $data['default_image'] = 'storage/' . $path;
        }

        $old = $product->getOriginal();
        $product->update($data);

        $changes = [];
        foreach ($product->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_product', "Updated product: {$product->name}", null, $product, $changes);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        if ($product->default_image && Storage::exists(str_replace('storage/', 'public/', $product->default_image))) {
            Storage::delete(str_replace('storage/', 'public/', $product->default_image));
        }

        $name = $product->name;
        $product->delete();

        LogService::log('delete_product', "Deleted product: {$name}", null, $product);

        return redirect()->back()->with('success', 'Product deleted.');
    }
}
