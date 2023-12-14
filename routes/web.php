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
});
