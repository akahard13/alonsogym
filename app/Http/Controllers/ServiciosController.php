<?php

namespace App\Http\Controllers;

use App\Models\PrecioServicio;
use App\Models\Servicio;
use App\Models\TipoPagoServicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiciosController extends Controller
{
    protected $admin;
    public function __construct()
    {
        $this->admin = env('ADMIN_ROL',1);
    }
    public function create()
    {
        $user_rol = Auth::user()->rol;
        $tipo_pagos = TipoPagoServicio::all();
        if ($user_rol == $this->admin) {
            return Inertia::render('Servicios/Create', ['tipo_pagos' => $tipo_pagos]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    public function store(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'nombre' => 'required|string',
                'modalidades' => 'nullable|array',
                'modalidades.*' => 'nullable|numeric|min:0',
            ]);
            $modalidades = $request->input('modalidades', []);
            $ids = array_keys($modalidades);
            $valores = array_values($modalidades);
            $servicio = Servicio::create([
                'nombre' => $request->nombre
            ]);
            foreach ($ids as $index => $id) {
                if (!empty($valores[$index])) {
                    PrecioServicio::create([
                        'servicio' => $servicio->id,
                        'tipo_pago' => $id,
                        'precio' => $valores[$index],
                    ]);
                }
            }
            return redirect()->route('servicios.index')->with('success', 'Servicio creado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function index()
    {
        $servicios = Servicio::where('activo', true)->with('precios')
            ->orderBy('id', 'asc')
            ->get();
        return Inertia::render('Servicios/Main', ['servicios' => $servicios]);
    }

    public function edit(Servicio $servicio)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $servicio = Servicio::findOrFail($servicio->id);
            $tipo_pagos = TipoPagoServicio::all(); 
            $precios= PrecioServicio::with('tipo_pago')->where('servicio', $servicio->id)->get(); // Suponiendo que esta es la lista de modalidades

            return Inertia::render('Servicios/Edit', [
                'servicio' => $servicio,
                'precios' => $precios,
                'tipo_pagos' => $tipo_pagos
            ]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    public function update(Request $request, $id)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            // Validación
            $request->validate([
                'nombre' => 'required|string',
                'modalidades' => 'nullable|array',
                'modalidades.*' => 'nullable|numeric|min:0',
            ]);

            // Obtener el servicio
            $servicio = Servicio::findOrFail($id);

            // Actualizar el nombre del servicio
            $servicio->update([
                'nombre' => $request->nombre,
            ]);

            // Obtener las modalidades del request
            $modalidades = $request->input('modalidades', []);
            $ids = array_keys($modalidades);
            $valores = array_values($modalidades);

            // Eliminar las modalidades existentes
            PrecioServicio::where('servicio', $id)->delete();

            // Insertar las modalidades actualizadas
            foreach ($ids as $index => $id) {
                if (!empty($valores[$index])) {
                    PrecioServicio::create([
                        'servicio' => $servicio->id,
                        'tipo_pago' => $id,
                        'precio' => $valores[$index],
                    ]);
                }
            }

            // Redirigir con mensaje de éxito
            return redirect()->route('servicios.index')->with('success', 'Servicio actualizado correctamente.');
        }

        // Si el usuario no tiene permisos, mostrar la vista de permisos
        return Inertia::render('NoPermissions');
    }


    public function destroy(Servicio $servicio)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $servicio->delete();
            return redirect()->route('servicios.index')->with('success', 'Servicio eliminado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
}
