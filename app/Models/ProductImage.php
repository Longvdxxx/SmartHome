<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $fillable = ['product_id', 'url'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

