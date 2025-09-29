<?php

namespace App\Observers;

use App\Services\LogService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ActivityObserver
{
    public function created(Model $model)
    {
        try {
            $actor = Auth::guard('web')->user() ?: Auth::guard('employee')->user() ?: Auth::guard('customer')->user();
            Log::debug('ActivityObserver.created called', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
                'actor' => $actor ? class_basename($actor) . '#' . $actor->id : null,
            ]);

            LogService::log('created', "Created " . class_basename($model) . " ID {$model->id}", $actor);

            Log::debug('ActivityObserver.created completed', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('ActivityObserver.created error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        }
    }

    public function updated(Model $model)
    {
        try {
            $actor = Auth::guard('web')->user() ?: Auth::guard('employee')->user() ?: Auth::guard('customer')->user();
            Log::debug('ActivityObserver.updated called', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
                'actor' => $actor ? class_basename($actor) . '#' . $actor->id : null,
            ]);

            // detailed changes optional
            $changes = $model->getChanges();
            Log::debug('Model changes', ['changes' => $changes]);

            LogService::log('updated', "Updated " . class_basename($model) . " ID {$model->id}. Changes: " . json_encode($changes), $actor);

            Log::debug('ActivityObserver.updated completed', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('ActivityObserver.updated error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        }
    }

    public function deleted(Model $model)
    {
        try {
            $actor = Auth::guard('web')->user() ?: Auth::guard('employee')->user() ?: Auth::guard('customer')->user();
            Log::debug('ActivityObserver.deleted called', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
                'actor' => $actor ? class_basename($actor) . '#' . $actor->id : null,
            ]);

            LogService::log('deleted', "Deleted " . class_basename($model) . " ID {$model->id}", $actor);

            Log::debug('ActivityObserver.deleted completed', [
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('ActivityObserver.deleted error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'model' => class_basename($model),
                'model_id' => $model->id ?? null,
            ]);
        }
    }
}
