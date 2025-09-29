<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserLog extends Model
{
    protected $fillable = [
        'loggable_type',
        'loggable_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'target_type',
        'target_id',
        'changes',
    ];

    public function loggable()
    {
        return $this->morphTo();
    }
}

