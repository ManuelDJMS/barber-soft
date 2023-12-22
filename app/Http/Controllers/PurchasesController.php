<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Products;

class PurchasesController extends Controller
{
    public function purchases(){
        $products=Products::all();
        return view("movements/purchases", array("products"=>$products));
    }
}
