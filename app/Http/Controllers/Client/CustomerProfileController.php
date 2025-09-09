<?php

namespace App\Http\Controllers\Client;

use App\Models\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerProfileController extends Controller
{
    public function edit()
    {
        $customer = Auth::guard('customer')->user();
        return Inertia::render('Client/Profile', [
            'customer' => $customer
        ]);
    }

    public function update(Request $request)
    {
        $customer = Customer::findOrFail(Auth::guard('customer')->id());

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => "required|email|unique:customers,email,{$customer->id}",
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update($request->only(['name', 'email', 'phone']));

        return back()->with('success', 'Profile updated successfully.');
    }

    public function editPassword()
    {
        return Inertia::render('Client/ChangePassword');
    }

    public function updatePassword(Request $request)
    {
        $customer = Auth::guard('customer')->user();

        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $customer->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect']);
        }

        $customer->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
