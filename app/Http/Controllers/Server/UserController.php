<?php

namespace App\Http\Controllers\Server;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Services\LogService;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->filled('sortField') && $request->filled('sortOrder')) {
            $query->orderBy(
                $request->input('sortField'),
                $request->input('sortOrder') == 1 ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $users = $query->paginate(10)->appends($request->query());

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only('search', 'sortField', 'sortOrder'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'role' => 'required|in:user,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'role' => $request->role,
        ]);

        LogService::log('create_user', "Created user: {$user->name}", null, $user);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => "required|email|unique:users,email,{$user->id}",
            'phone_number' => 'nullable|string|max:20',
            'role' => 'required|in:user,admin',
        ]);

        $old = $user->getOriginal();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
        ]);

        $changes = [];
        foreach ($user->getChanges() as $field => $value) {
            $changes[$field] = [
                'old' => $old[$field] ?? null,
                'new' => $value
            ];
        }

        LogService::log('update_user', "Updated user: {$user->name}", null, $user, $changes);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();

        LogService::log('delete_user', "Deleted user: {$name}", null, $user);

        return redirect()->back()->with('success', 'User deleted.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }
}
