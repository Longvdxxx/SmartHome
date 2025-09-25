<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'user_id',
        'customer_id',
        'store_id',
        'status',
        'total_price',
        'name',
        'email',
        'address',
        'phone',
    ];

    protected $casts = [
        'total_price' => 'float',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
