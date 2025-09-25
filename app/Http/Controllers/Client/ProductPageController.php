<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductPageController extends Controller
{
    public function show($id)
    {
        $product = Product::with(['images', 'reviews'])->findOrFail($id);

        $images = [];
        if ($product->default_image) {
            $images[] = [
                'id' => 0,
                'image_url' => '/' . ltrim($product->default_image, '/'),
                'is_default' => true,
            ];
        }

        foreach ($product->images as $img) {
            $images[] = [
                'id' => $img->id,
                'image_url' => '/' . ltrim($img->image_path ?? $img->url ?? '', '/'),
                'is_default' => false,
            ];
        }

        $reviews = $product->reviews->map(function ($r) {
            return [
                'id' => $r->id,
                'user_id' => $r->user_id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'created_at' => $r->created_at->format('d/m/Y'),
            ];
        });

        $relatedProducts = DB::table('product_recommendations')
            ->join('products', 'products.id', '=', 'product_recommendations.recommended_product_id')
            ->where('product_recommendations.product_id', $product->id)
            ->orderByDesc('score')
            ->limit(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => '$' . number_format($p->price, 2),
                    'image' => $p->default_image ? '/' . ltrim($p->default_image, '/') : null,
                ];
        });


        $averageRating = $reviews->count() > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        return Inertia::render('Client/ProductPage', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => '$' . number_format($product->price, 2),
                'stock' => $product->stock,
                'images' => $images,
                'reviews' => $reviews,
                'averageRating' => $averageRating,
            ],
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
