<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShareEmployee
{
    public function handle(Request $request, Closure $next)
    {
        Inertia::share([
            'auth' => [
                'user'     => Auth::guard('employee')->user() ?? Auth::guard('web')->user(),
                'employee' => Auth::guard('employee')->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);

        return $next($request);
    }
}
