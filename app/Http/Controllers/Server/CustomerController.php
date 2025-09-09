<?php

namespace App\Http\Controllers\Server;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query()
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        // Nếu là user thường thì chỉ lấy các trường cần thiết
        if (auth()->user()->role === 'user') {
            $query->select(['id', 'name', 'email', 'phone', 'created_at']);
        }

        $customers = $query->paginate(10)->appends(request()->query());

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
            'auth' => [
                'user' => [
                    'role' => auth()->user()->role
                ]
            ]
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

        Customer::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => "required|email|unique:customers,email,{$customer->id}",
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back()->with('success', 'Customer deleted.');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer
        ]);
    }

    public function create(Customer $customer)
    {
        return Inertia::render('Customers/Create', [
            'customer' => $customer
        ]);
    }

    public function show(Customer $customer)
    {
        return Inertia::render('Customers/Show', [
            'customer' => $customer
        ]);
    }

}
