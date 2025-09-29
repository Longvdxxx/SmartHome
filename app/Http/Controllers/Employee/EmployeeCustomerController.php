<?php

namespace App\Http\Controllers\Employee;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Services\LogService;

class EmployeeCustomerController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');
        $customers = [];

        if ($q) {
            $customers = Customer::query()
                ->where('name', 'like', "%$q%")
                ->orWhere('email', 'like', "%$q%")
                ->orWhere('phone', 'like', "%$q%")
                ->get();
        }

        return Inertia::render('Staff/CustomerPage', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:customers,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
        ]);

        $customer = Customer::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
        ]);

        LogService::log('create_customer', "Created customer: {$customer->id} - {$customer->name}");

        return redirect()->route('staff.customers.index')
            ->with('success', 'Customer created successfully.');
    }
}
