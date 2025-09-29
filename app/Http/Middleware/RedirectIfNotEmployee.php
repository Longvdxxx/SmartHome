<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfNotEmployee
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->routeIs('staff.login') || $request->routeIs('staff.login.submit')) {
            if (Auth::guard('employee')->check()) {
                return redirect()->route('staff.dashboard');
            }
        }

        if (!Auth::guard('employee')->check()) {
            return redirect()->route('staff.login');
        }

        return $next($request);
    }
}
