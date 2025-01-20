<?php

namespace App\Http\Controllers;

use App\Models\Categorias;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoriasController extends Controller
{
    protected $admin;

    public function __construct()
    {
        $this->admin = env('ADMIN_ROL');
    }

    public function index()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $categorias = Categorias::all();
            return Inertia::render('Categorias/Main', ['categorias' => $categorias]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function create()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            return Inertia::render('Categorias/Create');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function store(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            // Validación
            $request->validate([
                'nombre' => 'required|string|max:255',
                'icono' => 'nullable|string',
                'egreso' => 'boolean',
                'ingreso' => 'boolean',
            ]);

            // Forzar conversión a booleano
            $data = $request->all();
            $data['ingreso'] = filter_var($data['ingreso'], FILTER_VALIDATE_BOOLEAN);
            $data['egreso'] = filter_var($data['egreso'], FILTER_VALIDATE_BOOLEAN);

            Categorias::create($data);

            return redirect()->route('categorias.index')->with('success', 'Categoría creada correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }


    public function edit(Categorias $categoria)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            return Inertia::render('Categorias/Edit', ['categoria' => $categoria]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function update(Request $request, Categorias $categoria)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'icono' => 'nullable|string',
                'egreso' => 'nullable|boolean',
                'ingreso' => 'nullable|boolean',
            ]);

            $categoria->update($request->all());

            return redirect()->route('categorias.index')->with('success', 'Categoría actualizada correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function destroy(Categorias $categoria)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $categoria->delete();
            return redirect()->route('categorias.index')->with('success', 'Categoría eliminada correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }
}
