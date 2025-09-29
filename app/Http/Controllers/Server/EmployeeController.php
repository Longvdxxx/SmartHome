<?php

namespace App\Http\Controllers\Server;

use App\Models\Employee;
use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('store')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
            )
            ->orderBy($request->sortField ?? 'created_at', $request->sortOrder == -1 ? 'desc' : 'asc');

        $employees = $query->paginate(10)->appends(request()->query());
        $stores = Store::all(['id', 'name']);

        logger('Employee index accessed', [
            'user_id' => auth()->id(),
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
            'total'   => $employees->total(),
        ]);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters'   => $request->only('search', 'sortField', 'sortOrder'),
            'stores'    => $stores,
            'roles'     => ['Cashier', 'Manager', 'Stock'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:employees,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|string|in:cashier,manager,stock',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        $employee = Employee::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'store_id' => $request->store_id,
        ]);

        logger('Employee created', [
            'user_id'     => auth()->id(),
            'employee_id' => $employee->id,
            'data'        => $employee->toArray(),
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => "required|email|unique:employees,email,{$employee->id}",
            'role'     => 'required|string|in:cashier,manager,stock',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        $old = $employee->toArray();

        $employee->update([
            'name'     => $request->name,
            'email'    => $request->email,
            'role'     => $request->role,
            'store_id' => $request->store_id,
        ]);

        logger('Employee updated', [
            'user_id'     => auth()->id(),
            'employee_id' => $employee->id,
            'before'      => $old,
            'after'       => $employee->toArray(),
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $deleted = $employee->toArray();
        $employee->delete();

        logger('Employee deleted', [
            'user_id'     => auth()->id(),
            'employee_id' => $deleted['id'] ?? null,
            'data'        => $deleted,
        ]);

        return redirect()->back()->with('success', 'Employee deleted.');
    }

    public function edit(Employee $employee)
    {
        $stores = Store::all(['id', 'name']);

        logger('Employee edit page accessed', [
            'user_id'     => auth()->id(),
            'employee_id' => $employee->id,
        ]);

        return Inertia::render('Employees/Edit', [
            'employee' => $employee->load('store'),
            'stores'   => $stores,
            'roles'    => ['Cashier', 'Manager', 'Stock'],
        ]);
    }

    public function create()
    {
        $stores = Store::all(['id', 'name']);

        logger('Employee create page accessed', [
            'user_id' => auth()->id(),
        ]);

        return Inertia::render('Employees/Create', [
            'stores' => $stores,
            'roles'  => ['Cashier', 'Manager', 'Stock'],
        ]);
    }

    public function show(Employee $employee)
    {
        $stores = Store::all(['id', 'name']);

        logger('Employee show page accessed', [
            'user_id'     => auth()->id(),
            'employee_id' => $employee->id,
        ]);

        return Inertia::render('Employees/Show', [
            'employee' => $employee->load('store'),
            'stores'   => $stores,
            'roles'    => ['Cashier', 'Manager', 'Stock'],
        ]);
    }
}
