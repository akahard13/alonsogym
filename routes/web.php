<?php

use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PagoPersonalController;
use App\Http\Controllers\PagoServiciosController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiciosController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

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

    //Rutas para clientes y pagos de servicios
    Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::get('/clientes/create', [ClienteController::class, 'create'])->name('clientes.create');
    Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
    Route::get('/clientes/{cliente}/edit', [ClienteController::class, 'edit'])->name('clientes.edit');
    Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update');
    Route::delete('/clientes/{cliente}', [ClienteController::class, 'destroy'])->name('clientes.destroy');
    Route::get('/pago_servicios/{servicio}/{tipo_pago}/obtener_precio', [PagoServiciosController::class, 'obtener_precios'])->name('pago_servicios.obtener_precio');
    Route::get('/pago_servicios/{cliente}', [PagoServiciosController::class, 'index'])->name('pago_servicios.index');
    Route::get('/pago_servicios/{cliente}/create', [PagoServiciosController::class, 'create'])->name('pago_servicios.create');
    Route::post('/pago_servicios/store', [PagoServiciosController::class, 'store'])->name('pago_servicios.store');

    //Rutas para servicios
    Route::get('/servicios', [ServiciosController::class, 'index'])->name('servicios.index');
    Route::get('/servicios/create', [ServiciosController::class, 'create'])->name('servicios.create');
    Route::post('/servicios', [ServiciosController::class, 'store'])->name('servicios.store');
    Route::get('/servicios/{servicio}/edit', [ServiciosController::class, 'edit'])->name('servicios.edit');
    Route::put('/servicios/{servicio}', [ServiciosController::class, 'update'])->name('servicios.update');
    Route::delete('/servicios/{servicio}', [ServiciosController::class, 'destroy'])->name('servicios.destroy');

    //Rutas para personal y sus pagos
    Route::get('/personal', [PersonalController::class, 'index'])->name('personal.index');
    Route::get('/personal/create', [PersonalController::class, 'create'])->name('personal.create');
    Route::post('/personal', [PersonalController::class, 'store'])->name('personal.store');
    Route::get('/personal/{personal}/edit', [PersonalController::class, 'edit'])->name('personal.edit');
    Route::put('/personal/{personal}', [PersonalController::class, 'update'])->name('personal.update');
    Route::delete('/personal/{personal}', [PersonalController::class, 'destroy'])->name('personal.destroy');
    Route::get('/pago_personal/{personal}', [PagoPersonalController::class, 'index'])->name('pago_personal.index');
    Route::get('/pago_personal/{personal}/create', [PagoPersonalController::class, 'create'])->name('pago_personal.create');
    Route::post('/pago_personal/store', [PagoPersonalController::class, 'store'])->name('pago_personal.store');
    //Rutas para categorias
    Route::get('/categorias', [CategoriasController::class, 'index'])->name('categorias.index');
    Route::get('/categorias/create', [CategoriasController::class, 'create'])->name('categorias.create');
    Route::post('/categorias', [CategoriasController::class, 'store'])->name('categorias.store');
    Route::get('/categorias/{categoria}/edit', [CategoriasController::class, 'edit'])->name('categorias.edit');
    Route::put('/categorias/{categoria}', [CategoriasController::class, 'update'])->name('categorias.update');
    Route::delete('/categorias/{categoria}', [CategoriasController::class, 'destroy'])->name('categorias.destroy');

    // Rutas para el perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
