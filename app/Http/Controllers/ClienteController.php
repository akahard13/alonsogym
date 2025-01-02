<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClienteController extends Controller
{
    protected $admin;
    public function __construct()
    {
        $this->admin = env('ADMIN_ROL');
    }
    public function create()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $generos = Genero::all(); // Obtener los géneros disponibles
            return Inertia::render('Clientes/Create', ['generos' => $generos]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    public function store(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'fecha_nacimiento' => 'required|date',
                'celular' => 'required|string|max:15',
                'genero' => 'required|exists:generos,id',
                'huella' => 'nullable|string|max:255',
                'codigo' => 'required|string|max:255|unique:clientes,codigo',
            ]);

            Cliente::create($request->all());

            return redirect()->route('clientes.index')->with('success', 'Cliente creado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function index()
    {
        $clientes = Cliente::with('genero')->get();
        return Inertia::render('Clientes/Main', ['clientes' => $clientes]);
    }

    public function edit(Cliente $cliente)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $generos = Genero::all();
            return Inertia::render('Clientes/Edit', ['cliente' => $cliente, 'generos' => $generos]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    public function update(Request $request, Cliente $cliente)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'fecha_nacimiento' => 'required|date',
                'celular' => 'required|string|max:15',
                'genero' => 'required|exists:generos,id',
                'huella' => 'nullable|string|max:255',
                'codigo' => 'required|string|max:255|unique:clientes,codigo,' . $cliente->id,
            ]);

            $cliente->update($request->all());

            return redirect()->route('clientes.index')->with('success', 'Cliente actualizado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function destroy(Cliente $cliente)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $cliente->delete();
            return redirect()->route('clientes.index')->with('success', 'Cliente eliminado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
}
