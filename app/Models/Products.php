<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Products extends Model
{
    use HasFactory, SoftDeletes;

    protected $table="products";
    protected $dates = ['deleted_at'];
    protected $fillable=[
        "user_id",
        "category_id",
        "name",
        "xtock",
        "cost",
        "price_a",
        "price_b",
        "description"
    ];
}
