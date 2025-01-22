<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PersonalController extends Controller
{
    protected $admin;

    public function __construct()
    {
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index()
    {
        $personal = Personal::with('genero')->get();
        return Inertia::render('Personal/Main', ['personal' => $personal]);
    }

    public function create()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $generos = Genero::all();
            return Inertia::render('Personal/Create', ['generos' => $generos]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function store(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombres' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'genero' => 'required|exists:generos,id',
                'cargo' => 'required|string|max:255',
                'fecha_contratacion' => 'required|date',
                'salario' => 'required|numeric|min:0',
            ]);
            $nombres = ucwords(strtolower($request->nombres));
            $apellidos = ucwords(strtolower($request->apellidos));
            Personal::create([
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'genero' => $request->genero,
                'cargo' => $request->cargo,
                'celular' => $request->celular,
                'fecha_contratacion' => $request->fecha_contratacion,
                'salario' => $request->salario,
            ]);

            return redirect()->route('personal.index')->with('success', 'Personal creado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function edit(Personal $personal)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $generos = Genero::all();
            return Inertia::render('Personal/Edit', ['personal' => $personal, 'generos' => $generos]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function update(Request $request, Personal $personal)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombres' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'genero' => 'required|exists:generos,id',
                'cargo' => 'required|string|max:255',
                'fecha_contratacion' => 'required|date',
                'salario' => 'required|numeric|min:0',
            ]);

            $nombres = ucwords(strtolower($request->nombres));
            $apellidos = ucwords(strtolower($request->apellidos));

            $personal->update([
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'genero' => $request->genero,
                'cargo' => $request->cargo,
                'celular' => $request->celular,
                'fecha_contratacion' => $request->fecha_contratacion,
                'salario' => $request->salario,
            ]);

            return redirect()->route('personal.index')->with('success', 'Personal actualizado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function destroy(Personal $personal)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $personal->delete();
            return redirect()->route('personal.index')->with('success', 'Personal eliminado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }
}
