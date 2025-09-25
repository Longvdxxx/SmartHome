<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Brand;
use App\Models\CartItem;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                $user = Auth::guard('web')->user();
                $customer = Auth::guard('customer')->user();

                logger('Auth share:', [
                    'user' => $user ? $user->toArray() : null,
                    'customer' => $customer ? $customer->toArray() : null,
                ]);

                return [
                    'user' => $user ? [
                        'id'    => $user->id,
                        'name'  => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone_number,
                        'role'  => $user->role,
                    ] : null,

                    'customer' => $customer ? [
                        'id'    => $customer->id,
                        'name'  => $customer->name,
                        'email' => $customer->email,
                        'phone' => $customer->phone ?? null,
                    ] : null,
                ];
            },

            'flash' => fn () => [
                'success' => session('success'),
                'error'   => session('error'),
            ],

            'categories' => fn () => Category::select('id', 'name')->get(),
            'brands'     => fn () => Brand::select('id', 'name')->get(),

            'cartCount' => function () {
                $customer = Auth::guard('customer')->user();

                if ($customer) {
                    return CartItem::whereHas('cart', function ($query) use ($customer) {
                        $query->where('customer_id', $customer->id);
                    })->sum('quantity');
                }

                return 0;
            },
        ]);
    }
}
