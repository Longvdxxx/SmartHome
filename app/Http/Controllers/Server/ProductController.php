<?php

namespace App\Http\Controllers\Server;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
            'default_image' => 'nullable|image|max:20480', // thêm validate ảnh
        ]);

        $data = $request->only('category_id', 'brand_id', 'name', 'description', 'price', 'stock');

        if ($request->hasFile('default_image')) {
            $path = $request->file('default_image')->store('products', 'public');
            $data['default_image'] = 'storage/' . $path;
        }

        Product::create($data);

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

        // Nếu có upload ảnh mới
        if ($request->hasFile('default_image')) {
            // Xóa ảnh cũ nếu có
            if ($product->default_image && Storage::exists(str_replace('storage/', 'public/', $product->default_image))) {
                Storage::delete(str_replace('storage/', 'public/', $product->default_image));
            }

            $path = $request->file('default_image')->store('products', 'public');
            $data['default_image'] = 'storage/' . $path;
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Xóa ảnh mặc định nếu có
        if ($product->default_image && Storage::exists(str_replace('storage/', 'public/', $product->default_image))) {
            Storage::delete(str_replace('storage/', 'public/', $product->default_image));
        }

        $product->delete();
        return redirect()->back()->with('success', 'Product deleted.');
    }
}
