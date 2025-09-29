<?php

namespace App\Services;

use App\Models\UserLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class LogService
{
    /**
     * Ghi log cho user hoặc employee
     *
     * @param string $action
     * @param string|null $description
     * @param \Illuminate\Contracts\Auth\Authenticatable|null $actor
     * @param object|null $target  // model bị tác động (vd: Brand)
     * @param array|null $changes  // dữ liệu thay đổi (trước → sau)
     * @return UserLog|null
     */
    public static function log(string $action, ?string $description = null, $actor = null, $target = null, $changes = null)
    {
        if (!$actor) {
            $actor = Auth::guard('web')->user()
                   ?: Auth::guard('employee')->user()
                   ?: Auth::guard('customer')->user();
        }

        Log::debug('LogService called', [
            'action'       => $action,
            'description'  => $description,
            'actor'        => $actor ? (class_basename($actor) . '#' . $actor->id) : null,
            'target'       => $target ? (class_basename($target) . '#' . ($target->id ?? null)) : null,
            'changes'      => $changes,
            'request_ip'   => request()->ip(),
            'request_agent'=> request()->userAgent(),
        ]);

        if (!$actor) {
            Log::warning('LogService: no authenticated actor found, skipping DB insert', [
                'action' => $action, 'description' => $description
            ]);
            return null;
        }

        try {
            $log = $actor->logs()->create([
                'action'        => $action,
                'description'   => $description,
                'ip_address'    => request()->ip(),
                'user_agent'    => request()->userAgent(),
                'loggable_type' => get_class($actor),
                'loggable_id'   => $actor->id,
                'target_type'   => $target ? get_class($target) : null,
                'target_id'     => $target->id ?? null,
                'changes'       => $changes ? json_encode($changes) : null,
            ]);

            if ($log) {
                Log::debug('LogService: user_log created', [
                    'id' => $log->id,
                    'loggable_type' => $log->loggable_type,
                ]);
            } else {
                Log::error('LogService: create returned null', [
                    'action' => $action,
                    'actor'  => class_basename($actor) . '#' . $actor->id,
                ]);
            }

            return $log;
        } catch (Throwable $e) {
            Log::error('LogService failed to create UserLog', [
                'error'  => $e->getMessage(),
                'trace'  => $e->getTraceAsString(),
                'actor'  => $actor ? class_basename($actor) . '#' . $actor->id : null,
                'action' => $action,
            ]);
            return null;
        }
    }
}
