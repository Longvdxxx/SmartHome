<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Banner;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $customer = Auth::guard('customer')->user();

        return Inertia::render('Client/Dashboard', [
            'user' => $customer ? [
                'name'  => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone ?? null,
            ] : null,
            'banners'     => $this->getBanners(),
            'bestSellers' => $this->getBestSellers(),
            'newProducts' => $this->getNewProducts(),
        ]);
    }

    private function getBanners()
    {
        return Banner::with('product:id,name,price')
            ->inRandomOrder()
            ->take(6)
            ->get()
            ->map(function ($banner) {
                return [
                    'id'        => $banner->id,
                    'image'     => $banner->image_url ? '/' . ltrim($banner->image_url, '/') : null,
                    'productId' => $banner->product_id,
                    'link'      => $banner->product_id
                        ? url('/products/' . $banner->product_id)
                        : null,
                ];
            });
    }

    private function getBestSellers()
    {
        return DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('product_images', function ($join) {
                $join->on('products.id', '=', 'product_images.product_id')
                    ->whereRaw('product_images.id = (SELECT MIN(id) FROM product_images WHERE product_id = products.id)');
            })
            ->select(
                'products.id',
                'products.name',
                'products.price',
                DB::raw('SUM(order_items.quantity) as sold'),
                'products.default_image',
                'product_images.url as image'
            )
            ->groupBy('products.id', 'products.name', 'products.price', 'products.default_image', 'product_images.url')
            ->orderByDesc('sold')
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id'    => $product->id,
                    'name'  => $product->name,
                    'sold'  => $product->sold,
                    'price' => '$' . number_format($product->price, 2), // thêm price
                    'image' => $product->image
                        ? '/' . ltrim($product->image, '/')
                        : ($product->default_image ? '/' . ltrim($product->default_image, '/') : null),
                ];
            });
    }


    private function getNewProducts()
    {
        return DB::table('products')
            ->leftJoin('product_images', function ($join) {
                $join->on('products.id', '=', 'product_images.product_id')
                     ->whereRaw('product_images.id = (SELECT MIN(id) FROM product_images WHERE product_id = products.id)');
            })
            ->select(
                'products.id',
                'products.name',
                'products.price',
                'products.default_image',
                'product_images.url as image',
                'products.created_at'
            )
            ->orderBy('products.created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id'        => $product->id,
                    'name'      => $product->name,
                    'price'     => '$' . number_format($product->price, 2),
                    'image'     => $product->image
                        ? '/' . ltrim($product->image, '/')
                        : ($product->default_image ? '/' . ltrim($product->default_image, '/') : null),
                    'addedDate' => Carbon::parse($product->created_at)->diffForHumans(),
                ];
            });
    }
}
