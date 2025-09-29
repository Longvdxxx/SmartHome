<?php

namespace App\Http\Controllers\Server;

use App\Http\Controllers\Controller;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $query = UserLog::query();

        // Action filter (dùng LIKE để match nhiều loại)
        if ($request->filled('action')) {
            $action = $request->action;
            if ($action === 'created') {
                $query->where('action', 'like', '%create%');
            } elseif ($action === 'updated') {
                $query->where('action', 'like', '%update%');
            } elseif ($action === 'deleted') {
                $query->where('action', 'like', '%delete%');
            } else {
                $query->where('action', $action);
            }
        }

        // Search filter (search nhiều cột)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%$search%")
                  ->orWhere('loggable_type', 'like', "%$search%")
                  ->orWhere('ip_address', 'like', "%$search%")
                  ->orWhere('action', 'like', "%$search%");
            });
        }

        $logs = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn($log) => [
                'id' => $log->id,
                'loggable_type' => $log->loggable_type,
                'loggable_id' => $log->loggable_id,
                'action' => $log->action,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
                'old_values' => $log->old_values ? json_decode($log->old_values, true) : null,
                'new_values' => $log->new_values ? json_decode($log->new_values, true) : null,
                'changes' => $log->changes ? json_decode($log->changes, true) : null,
                'created_at' => $log->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Logs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'action']),
        ]);
    }
}
