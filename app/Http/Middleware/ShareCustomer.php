<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Brand;

class ShareCustomer
{
    public function handle(Request $request, Closure $next)
    {
        Inertia::share([
            'auth' => [
                'user' => Auth::guard('web')->user(),
                'customer' => Auth::guard('customer')->user(),
            ],
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);

        return $next($request);
    }
}
