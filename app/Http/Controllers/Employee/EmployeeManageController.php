<?php

namespace App\Http\Controllers\Employee;

use App\Models\Employee;
use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EmployeeManageController extends Controller
{
    public function __construct()
    {
        $this->middleware('employee.role:manager');
    }

    public function index()
    {
        $manager = auth('employee')->user();

        $employees = Employee::with('store')
            ->where('store_id', $manager->store_id)
            ->get();

        Log::info('Manager viewed employee list.', ['manager_id' => $manager->id]);

        return Inertia::render('Staff/EmployeeIndex', [
            'employees' => $employees,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function create()
    {
        $manager = auth('employee')->user();
        $stores = Store::where('id', $manager->store_id)->get();

        return Inertia::render('Staff/CreateEmployee', [
            'stores' => $stores,
            'auth' => ['user' => $manager],
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function store(Request $request)
    {
        $manager = auth('employee')->user();

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:employees',
            'role'     => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validated['role'] === 'manager') {
            return redirect()->back()->with('error', 'You cannot create another manager.');
        }

        $validated['store_id'] = $manager->store_id;
        $validated['password'] = bcrypt($validated['password']);

        $employee = Employee::create($validated);

        Log::info('Manager created employee', [
            'manager_id'  => $manager->id,
            'employee_id' => $employee->id,
        ]);

        return redirect()->route('staff.manage.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show($id)
    {
        $manager = auth('employee')->user();

        $employee = Employee::where('store_id', $manager->store_id)
            ->with('store')
            ->findOrFail($id);

        return Inertia::render('Staff/ShowEmployee', [
            'employee' => $employee,
            'auth' => ['user' => $manager],
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function edit($id)
    {
        $manager = auth('employee')->user();
        $employee = Employee::where('store_id', $manager->store_id)->findOrFail($id);

        if ($employee->role === 'manager') {
            return redirect()->route('staff.manage.index')->with('error', 'You cannot edit another manager.');
        }

        $stores = Store::where('id', $manager->store_id)->get();

        return Inertia::render('Staff/EditEmployee', [
            'employee' => $employee,
            'stores' => $stores,
            'auth' => ['user' => $manager],
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function update(Request $request, $id)
    {
        $manager = auth('employee')->user();
        $employee = Employee::where('store_id', $manager->store_id)->findOrFail($id);

        if ($employee->role === 'manager') {
            return redirect()->route('staff.manage.index')->with('error', 'You cannot modify another manager.');
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => "required|email|unique:employees,email,{$id}",
            'role'     => 'required|string',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validated['role'] === 'manager') {
            return redirect()->route('staff.manage.index')->with('error', 'You cannot change role to manager.');
        }

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $employee->update($validated);

        Log::info('Manager updated employee', [
            'manager_id'  => $manager->id,
            'employee_id' => $employee->id,
        ]);

        return redirect()->route('staff.manage.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy($id)
    {
        $manager = auth('employee')->user();
        $employee = Employee::where('store_id', $manager->store_id)->findOrFail($id);

        if ($employee->role === 'manager') {
            return redirect()->route('staff.manage.index')->with('error', 'You cannot delete another manager.');
        }

        $employee->delete();

        Log::info('Manager deleted employee', [
            'manager_id'  => $manager->id,
            'employee_id' => $id,
        ]);

        return redirect()->route('staff.manage.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
