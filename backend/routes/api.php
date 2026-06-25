<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// JWT Auth
Route::post('auth/login',  [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('auth/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:api');
Route::get('auth/me',      [\App\Http\Controllers\Api\AuthController::class, 'me'])->middleware('auth:api');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return auth()->user();
});

Wave::api();

// Posts Example API Route
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/posts', '\App\Http\Controllers\Api\ApiController@posts');
});

// V1 API — creator platform
Route::prefix('v1')->middleware('auth:api')->group(function () {
    Route::apiResource('projects', \App\Http\Controllers\Api\ProjectController::class);
    Route::get('templates', [\App\Http\Controllers\Api\TemplateController::class, 'index']);
    Route::get('music', [\App\Http\Controllers\Api\MusicController::class, 'index']);
    Route::post('music/generate', [\App\Http\Controllers\Api\MusicController::class, 'generate']);
    Route::get('images', [\App\Http\Controllers\Api\ImageController::class, 'index']);
    Route::post('images/generate', [\App\Http\Controllers\Api\ImageController::class, 'generate']);
    Route::post('video/render', [\App\Http\Controllers\Api\VideoRenderController::class, 'render']);
    Route::get('video/render/{id}/status', [\App\Http\Controllers\Api\VideoRenderController::class, 'status']);
    Route::post('tts/generate', [\App\Http\Controllers\Api\TtsController::class, 'generate']);
    Route::get('tts/voices', [\App\Http\Controllers\Api\TtsController::class, 'voices']);
    Route::post('avatars', [\App\Http\Controllers\Api\AvatarController::class, 'generate']);
    Route::get('avatars', [\App\Http\Controllers\Api\AvatarController::class, 'index']);
    Route::get('avatars/{id}/status', [\App\Http\Controllers\Api\AvatarController::class, 'status']);

    // Social platform connections
    Route::get('social/accounts', [\App\Http\Controllers\Api\SocialController::class, 'accounts']);
    Route::get('social/connect/{platform}', [\App\Http\Controllers\Api\SocialController::class, 'connect']);
    Route::delete('social/{platform}', [\App\Http\Controllers\Api\SocialController::class, 'disconnect']);

    // Publishing
    Route::post('publish', [\App\Http\Controllers\Api\PublishController::class, 'publish']);
    Route::get('publish', [\App\Http\Controllers\Api\PublishController::class, 'index']);
    Route::get('publish/{id}/status', [\App\Http\Controllers\Api\PublishController::class, 'status']);
});

// OAuth callback — no JWT auth (Google/Facebook redirect won't include it)
// User identity carried via encrypted state= param set in connect()
Route::get('social/callback/{platform}', [\App\Http\Controllers\Api\SocialController::class, 'callback'])
    ->name('social.callback');
