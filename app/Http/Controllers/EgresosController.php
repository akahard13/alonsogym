<?php

namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Egresos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EgresosController extends Controller
{
    protected $admin;
    public function __construct()
    {
        $this->admin = env('ADMIN_ROL',1);
    }
    public function index()
    {
        $egresos = Egresos::with('categoria')->get();
        return Inertia::render('Finanzas/Main', [
            'datos' => $egresos,
            'editar' => 'egresos.edit',
            'eliminar' => 'egresos.destroy',
            'create' => 'egresos.create',
            'titulo' => 'Egresos'
        ]);
    }
    public function create()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $categorias = Categorias::where('egreso', true)->get();
            return Inertia::render('Finanzas/Create', ['categorias' => $categorias, 'store' => 'egresos.store', 'titulo' => 'Egresos', 'nombre' => 'egreso']);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
    public function store(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'descripcion' => 'required|string|max:1500',
                'total' => 'required|numeric',
                'fecha' => 'required|date',
                'categoria' => 'required|exists:categorias,id',
            ]);
            Egresos::create($request->all());
            return redirect()->route('egresos.index')->with('success', 'Egreso creado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
    public function edit(Egresos $egresos)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            Categorias::all();
            return Inertia::render('Finanzas/Edit', ['dato' => $egresos, 'categorias' => Categorias::all(), 'update' => 'egresos.update',
            'titulo' => 'Egresos', 'nombre' => 'egreso']);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
    public function update(Request $request, Egresos $egresos)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'descripcion' => 'required|string|max:1500',
                'total' => 'required|numeric',
                'fecha' => 'required|date',
                'categoria' => 'required|exists:categorias,id',
            ]);
            $egresos->update($request->all());
            return redirect()->route('egresos.index')->with('success', 'Egreso actualizado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Egresos $ingresos)
    {
        $ingresos->delete();
        return redirect()->route('ingresos.index')->with('success', 'Ingreso eliminado correctamente.');
    }
}
