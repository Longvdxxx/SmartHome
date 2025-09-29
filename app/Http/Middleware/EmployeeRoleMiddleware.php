<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class EmployeeRoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        $employee = Auth::guard('employee')->user();

        if (!$employee || !in_array($employee->role, $roles)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
