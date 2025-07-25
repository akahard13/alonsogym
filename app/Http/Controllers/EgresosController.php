<?php

namespace App\Http\Controllers;

use App\Models\Categorias;
use App\Models\Egresos;
use App\Models\PagoPersonal;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EgresosController extends Controller
{
    protected $admin;
    public function __construct()
    {
        date_default_timezone_set('America/Managua');
        $this->admin = env('ADMIN_ROL', 1);
    }
    public function index()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $egresos = Egresos::with('categoria')->get();
            return Inertia::render('Finanzas/Main', [
                'datos' => $egresos,
                'editar' => 'egresos.edit',
                'eliminar' => 'egresos.destroy',
                'create' => 'egresos.create',
                'titulo' => 'Egresos',
                'fecha' => date('Y-m-d'),
                'categorias' => Categorias::where('egreso', true)->get()
            ]);
        }
        return Inertia::render('NoPermissions');
    }
    public function create()
    {
        $fecha = new DateTime();
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $categorias = Categorias::where('egreso', true)->get();
            return Inertia::render('Finanzas/Create', ['fecha' => $fecha->format('Y-m-d'), 'categorias' => $categorias, 'store' => 'egresos.store', 'titulo' => 'Egresos', 'nombre' => 'egreso']);
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
            return Inertia::render('Finanzas/Edit', [
                'dato' => $egresos,
                'categorias' => Categorias::all(),
                'update' => 'egresos.update',
                'titulo' => 'Egresos',
                'nombre' => 'egreso'
            ]);
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
    public function destroy(Egresos $egresos)
    {
        $id_pago = $egresos->id_pago_personal ?? null;
        $pago_personal = PagoPersonal::find($id_pago);
        if ($pago_personal) {
            $pago_personal->delete();
        }
        $egresos->delete();
        return redirect()->route('ingresos.index')->with('success', 'Ingreso eliminado correctamente.');
    }
}
