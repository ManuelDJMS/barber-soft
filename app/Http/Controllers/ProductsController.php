<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Categories;
use Yajra\DataTables\DataTables;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;
use Auth;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $products=DB::select("select products.id, category_id, products.name as name, categories.name as category, xtock, cost,
                price_a, price_b from products inner join categories on products.category_id=categories.id where products.deleted_at is null");
            return Datatables::of($products)
                    ->addIndexColumn()
                    ->addColumn('check', function($row){
                           $btn = '<div class="form-check form-check-sm form-check-custom form-check-solid">
                           <input class="form-check-input" type="checkbox" value="1" data-id="'.$row->id.'" />
                       </div>';
                            return $btn;
                    })
                    ->addIndexColumn()
                    ->addColumn('buttons', function($row){
                           $btn = '<button data-id="'.$row->id.'" type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" data-kt-product-table-filter="edit">
                           <span class="svg-icon svg-icon-3">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                   <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path>
                                   <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path>
                               </svg>
                           </span>
                       </button>';
                            return $btn;
                    })
                    ->rawColumns(['check', 'buttons'])
                    ->make(true);
        }
        $categories=Categories::all();
        return view('catalogs/products', array("categories"=>$categories));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $products = Products::updateOrCreate(
            ['id'=>$request->get('id_product')],
            ['user_id'=>Auth::user()->id,
            'category_id'=>$request->get('category_id'),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'xtock'=> $request->input('xtock'),
            'cost'=> $request->input('cost'),
            'price_a'=> $request->input('price_a'),
            'price_b'=> $request->input('price_b'),
        ],
        );
        return response()->json(["OK"=>"Se guardo correctamente"]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product=Products::find($id);

        return response()->json(['product'=>$product]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy_products(Request $request)
    {
        $ids = $request->input('ids');
        Products::whereIn('id', $ids)->delete();
        return response()->json(["OK"=>"Eliminados"]);
    }
}
