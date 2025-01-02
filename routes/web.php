<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Rutas para roles
    //Route::get('/roles', [RoleController::class, 'index'])->name('roles.index'); // Listar roles
    // Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create'); // Formulario de creación
    // Route::post('/roles', [RoleController::class, 'store'])->name('roles.store'); // Guardar nuevo rol
    // Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit'); // Formulario de edición
    // Route::patch('/roles/{role}', [RoleController::class, 'update'])->name('roles.update'); // Actualizar rol existente
    // Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy'); // Eliminar rol
    //Rutas para clientes
    Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::get('/clientes/create', [ClienteController::class, 'create'])->name('clientes.create');
    Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
    Route::get('/clientes/{cliente}/edit', [ClienteController::class, 'edit'])->name('clientes.edit');
    Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update');
    Route::delete('/clientes/{cliente}', [ClienteController::class, 'destroy'])->name('clientes.destroy');

    // Rutas para el perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
