<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Genero;
use App\Models\Ingresos;
use App\Models\PagoServicio;
use App\Models\Servicio;
use App\Models\TipoPagoServicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            $servicios = Servicio::Where('activo', true)->get();
            $tipo_pagos = TipoPagoServicio::all();
            $generos = Genero::all(); // Obtener los géneros disponibles
            return Inertia::render('Clientes/Create', ['generos' => $generos, 'servicios' => $servicios, 'tipo_pagos' => $tipo_pagos]);
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
    public function pago(Request $request)
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
                'servicio' => 'required|exists:servicios,id',
                'tipo_pago' => 'required|exists:tipo_pagos_servicios,id',
                'fecha_pago' => 'required|date',
                'precio' => 'required|numeric|min:0',
                'fecha_vencimiento' => 'required|date',
            ]);
            $cliente = Cliente::create($request->all());
            $servicio = Servicio::find($request->servicio);
            $tipo_pago = TipoPagoServicio::find($request->tipo_pago);
            PagoServicio::create([
                'cliente' => $cliente->id,
                'servicio' => $request->servicio,
                'tipo_pago' => $request->tipo_pago,
                'fecha_pago' => $request->fecha_pago,
                'precio' => $request->precio,
                'fecha_vencimiento' => $request->fecha_vencimiento
            ]); // Crear nuevo registro de pago personal
            //registramos el ingreso
            Ingresos::create([
                'categoria' => 1, // Categoría de ingreso para pagos de servicios de los clientes
                'fecha' => $request->fecha_pago,
                'total' => $request->precio,
                'descripcion' => "Pago de servicio correspondiente a $cliente->nombre por concepto de $tipo_pago->nombre del servicio $servicio->nombre"
            ]);

            return redirect()->route('clientes.index')->with('success', 'Cliente creado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }
    public function index()
    {
        $clientes = Cliente::with('genero')->get();
        return Inertia::render('Clientes/Main', ['clientes' => $clientes]);
    }
    public function activos()
    {
        $clientes = $this->obtenerClientes(true);
        return Inertia::render('Planes', ['clientes' => $clientes]);
    }
    public function inactivos()
    {
        $clientes = $this->obtenerClientes(false);
        return Inertia::render('Planes', ['clientes' => $clientes]);
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
    private function obtenerClientes($estado = true)
    {
        $clientes = DB::table('clientes as cli')
            ->join('pago_servicios as ps', function ($join) {
                $join->on('cli.id', '=', 'ps.cliente')
                    ->whereRaw('ps.fecha_pago = (SELECT MAX(sub_ps.fecha_pago) FROM pago_servicios AS sub_ps WHERE sub_ps.cliente = cli.id)');
            })
            ->join('generos as g', 'cli.genero', '=', 'g.id')
            ->join('servicios as s', 'ps.servicio', '=', 's.id')
            ->select(
                'cli.id',
                'cli.nombre',
                'cli.codigo',
                'ps.fecha_pago',
                'ps.fecha_vencimiento',
                'g.nombre as genero',
                's.nombre as servicio',
                DB::raw('CASE 
                     WHEN NOW()::date <= ps.fecha_vencimiento::date THEN true 
                     ELSE false 
                 END AS estado'),
                DB::raw('CASE 
                     WHEN NOW()::date = ps.fecha_vencimiento::date THEN \'Último día\' 
                     ELSE ((ps.fecha_vencimiento::date - NOW()::date)::text || \' días\') 
                 END AS dias_restantes'),
                DB::raw('ps.fecha_vencimiento::date - NOW()::date AS dias_restantes_numerico')
            )
            ->orderBy('dias_restantes_numerico', 'asc')
            ->get();



        $clientes = $clientes->filter(function ($cliente) use ($estado) {
            return $cliente->estado == $estado;
        });

        return $clientes->toArray();
    }
}
