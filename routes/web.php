<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the 'web' middleware group. Now create something great!
|
*/

Route::get('/', function () {
	return view('welcome');
});

Auth::routes(['register' => false]);

Route::get('/home', 'HomeController@index')->name('home');

Route::group(
	[
		'prefix' => 'admin',
		'namespace' => 'Admin',
		'as' => 'admin.',
	],
	function(){
		Route::redirect('/', url(config('formbuilder.url_path', '/form-builder').'/forms'));
		// Route::get('/',['as' => 'dashboard','uses' => 'DashboardController@show']);
	}
);

Route::group(
	[
		'prefix' => 'hubspot',
		'namespace' => 'Forms',
		'as' => 'hubspot.',
	],
	function(){
		Route::post('/save', 'HubspotController@createForm');
		Route::put('/save', 'HubspotController@updateForm');
		Route::delete('/delete', 'HubspotController@deleteForm');

		Route::post('/submit','HubspotSubmissionController@submission');
	}
);