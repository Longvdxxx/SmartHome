<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmployeeProfileController extends Controller
{
    public function editProfile()
    {
        $employee = auth('employee')->user();

        return Inertia::render('Staff/ProfileEdit', [
            'employee' => $employee,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $employee = auth('employee')->user();

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => "required|email|unique:employees,email,{$employee->id}",
        ]);

        $employee->update($validated);

        Log::info('Employee updated personal info', ['employee_id' => $employee->id]);

        return redirect()->route('staff.profile.edit')
            ->with('success', 'Profile updated successfully.');
    }

    public function editPassword()
    {
        $employee = auth('employee')->user();

        return Inertia::render('Staff/ProfilePassword', [
            'employee' => $employee,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $employee = auth('employee')->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($validated['current_password'], $employee->password)) {
            return back()->with('error', 'Current password is incorrect.');
        }

        $employee->update([
            'password' => Hash::make($validated['password']),
        ]);

        Log::info('Employee changed password', ['employee_id' => $employee->id]);

        return redirect()->route('employee.password.edit')
            ->with('success', 'Password changed successfully.');
    }
}
