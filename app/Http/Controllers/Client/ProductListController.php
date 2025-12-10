<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductListController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('brand')) {
            $query->where('brand_id', $request->brand);
        }

        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Client/ProductList', [
            'products'   => $products->through(fn($p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'price' => '$' . number_format($p->price, 2),
                'image' => $p->default_image ? '/' . ltrim($p->default_image, '/') : null,
            ]),
            'filters'    => $request->only(['search', 'category', 'brand', 'sort']),
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
        ]);
    }
}
