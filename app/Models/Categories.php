<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categories extends Model
{
    use HasFactory, SoftDeletes;

    protected $table="categories";
    protected $dates = ['deleted_at'];
    protected $fillable=[
        "user_id",
        "name",
        "description"
    ];
}
