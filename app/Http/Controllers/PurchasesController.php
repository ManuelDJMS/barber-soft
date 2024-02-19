<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Purchases;
use App\Models\PurchasesDetails;
use Auth;
class PurchasesController extends Controller
{
    public function purchases(){
        $products=Products::all();
        return view("movements/purchases", array("products"=>$products));
    }

    public function save_purchase(Request $request){
        $products =json_decode($request->get('products'), true);
         // Crear una nueva compra
        $purchase = new Purchases();
        $purchase->user_id=Auth::user()->id;
        $purchase->purchase_date=$request->get('date');
        $purchase->total=$request->get('total');
        $purchase->save();

        // Guardar cada producto asociado a la compra
        foreach ($products as $productData) {
            $product = new PurchasesDetails();
            $product->product_id = $productData[0]; // Ajusta según la estructura de tus datos
            $product->cost = $productData[2]; // Ajusta según la estructura de tus datos
            $product->quantity = $productData[3]; // Ajusta según la estructura de tus datos
            $product->purchase_id = $purchase->id; // Asignar la relación con la compra
            $product->save();
        }

        return response()->json(["OK"=>"OK"]);
    }
}
