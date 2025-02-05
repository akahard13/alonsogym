<?php

namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Ingresos;
use App\Models\odel;
use App\Models\PagoServicio;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IngresosController extends Controller
{
    protected $admin;
    public function __construct()
    {
        date_default_timezone_set('America/Managua');
        $this->admin = env('ADMIN_ROL', 1);
    }
    public function index()
    {
        $ingresos = Ingresos::with('categoria')->get();
        return Inertia::render('Finanzas/Main', [
            'datos' => $ingresos,
            'editar' => 'ingresos.edit',
            'eliminar' => 'ingresos.destroy',
            'create' => 'ingresos.create',
            'titulo' => 'Ingresos',
            'fecha' => date('Y-m-d')
        ]);
    }
    public function create()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $fecha = new DateTime();
            $categorias = Categorias::where('ingreso', true)->get();
            return Inertia::render('Finanzas/Create', ['fecha' => $fecha->format('Y-m-d'), 'categorias' => $categorias, 'store' => 'ingresos.store', 'titulo' => 'Ingresos', 'nombre' => 'ingreso']);
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
            Ingresos::create($request->all());
            return redirect()->route('ingresos.index')->with('success', 'Ingreso creado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
    public function edit(Ingresos $ingresos)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            Categorias::all();
            return Inertia::render('Finanzas/Edit', [
                'dato' => $ingresos,
                'categorias' => Categorias::all(),
                'update' => 'ingresos.update',
                'titulo' => 'Ingresos',
                'nombre' => 'ingreso'
            ]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }
    public function update(Request $request, Ingresos $ingresos)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'descripcion' => 'required|string|max:1500',
                'total' => 'required|numeric',
                'fecha' => 'required|date',
                'categoria' => 'required|exists:categorias,id',
            ]);
            $ingresos->update($request->all());
            return redirect()->route('ingresos.index')->with('success', 'Ingreso actualizado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta accion');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingresos $ingresos)
    {
        $id_pago = $ingresos->id_pago_servicio??null;
        $pago_servicio = PagoServicio::find($id_pago);
        $ingresos->delete();
        if ($pago_servicio) {
            $pago_servicio->delete();
        }
        return redirect()->route('ingresos.index')->with('success', 'Ingreso eliminado correctamente.');
    }
}
