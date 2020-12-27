<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group([ 'middleware' => 'setlocale'], function() {

    Route::get('/', function () {
        return view('welcome');
    });

});

Route::group(['prefix' => '{locale}', 'middleware' => 'setlocale'], function() {
    Route::any('/', function(){
        return view('welcome');
    });
    Route::any('/en', 'GMA\WebController@index')->name('home');
});