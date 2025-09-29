<?php

namespace App\Traits;

use App\Models\UserLog;

trait HasLogs
{
    public function logs()
    {
        return $this->morphMany(UserLog::class, 'loggable');
    }
}
