<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $fillable = ['order_id', 'method', 'amount', 'paid_at'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
