<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    // PERMISSIONS
    Route::resource('permissions', 'App\Http\Controllers\PermissionsController');
    Route::post('destroy_permissions', 'App\Http\Controllers\PermissionsController@destroy_permissions');
    // ROLES
    Route::resource('roles', 'App\Http\Controllers\RolesController');
    Route::post('destroy_roles', 'App\Http\Controllers\RolesController@destroy_roles');
    //USERS
    Route::resource("users", "App\Http\Controllers\UsersController");
    Route::post("destroy_users", "App\Http\Controllers\UsersController@destroy_users");
    Route::get('get_user_permission', 'App\Http\Controllers\UsersController@get_user_permission');
    Route::post('save_user_permissions', 'App\Http\Controllers\UsersController@save_user_permissions');
    // CATEGORIES
    Route::resource('categories', 'App\Http\Controllers\CategoriesController');
    Route::post('destroy_categories', 'App\Http\Controllers\CategoriesController@destroy_categories');
    // PRODUCTS
    Route::resource('products', 'App\Http\Controllers\ProductsController');
    Route::post('destroy_products', 'App\Http\Controllers\ProductsController@destroy_products');
    // PURCHASES
    Route::get('purchases', 'App\Http\Controllers\PurchasesController@purchases');
});
