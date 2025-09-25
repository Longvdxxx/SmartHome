<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
    ];

    public function inventories()
    {
        return $this->hasMany(StoreInventory::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
