<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [ExpenseController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

Route::post('/expenses', [ExpenseController::class, 'store'])->middleware('auth');
Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/products', fn () => Inertia::render('Products/page'))->name('products');
});

require __DIR__.'/auth.php';
