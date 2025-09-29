<?php

namespace App\Http\Controllers\Employee;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Services\LogService;

class EmployeeAuthController extends Controller
{
    public function showLogin()
    {
        return inertia('Staff/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('employee')->attempt($credentials)) {
            $request->session()->regenerate();

            $employee = Auth::guard('employee')->user();

            LogService::log('employee_login', "Employee {$employee->id} logged in");

            return redirect()->intended(route('staff.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Invalid credentials.',
        ]);
    }

    public function logout(Request $request)
    {
        $employee = Auth::guard('employee')->user();
        if ($employee) {
            LogService::log('employee_logout', "Employee {$employee->id} logged out");
        }

        Auth::guard('employee')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('staff.login');
    }
}
