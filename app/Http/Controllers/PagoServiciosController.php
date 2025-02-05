<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Egresos;
use App\Models\Ingresos;
use App\Models\PagoPersonal;
use App\Models\PagoServicio;
use App\Models\Personal;
use App\Models\PrecioServicio;
use App\Models\Servicio;
use App\Models\TipoPagoServicio;
use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Whoops\Exception\Formatter;

class PagoServiciosController extends Controller
{
    protected $admin;

    public function __construct()
    {
        date_default_timezone_set('America/Managua');
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index(Cliente $cliente): Response
    {
        try {
            $user_rol = Auth::user()->rol;
            if ($user_rol !== (int)$this->admin) {
                return Inertia::render('NoPermissions');
            }

            $clienteData = Cliente::with('genero')->find($cliente->id);

            $pagos = DB::table('pago_servicios as ps')
                ->join('servicios', 'ps.servicio', '=', 'servicios.id')
                ->join('tipo_pagos_servicios as tipo_pago', 'ps.tipo_pago', '=', 'tipo_pago.id')
                ->where('ps.cliente', $cliente->id)
                ->orderBy('ps.fecha_pago', 'desc')
                ->select(
                    'ps.*',
                    'servicios.nombre as servicio', // Asegúrate de que 'nombre' es el campo que quieres de la tabla 'servicios'
                    'tipo_pago.nombre as tipo_pago' // Asegúrate de que 'nombre' es el campo que quieres de la tabla 'tipo_pago'
                )
                ->get();

            $ultimo_pago = $this->ultimo_pago($cliente->id);

            return Inertia::render('PagoServicios/Main', [
                'information' => $clienteData,
                'ultimoPago' => $ultimo_pago,
                'pagos' => $pagos,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('ErrorPage', [
                'message' => 'Ocurrió un error al procesar la solicitud.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function ultimo_pago($id)
    {
        try {
            $ultimopago = DB::table('pago_servicios as pps')
                ->select('pps.*', 'tps.nombre as tipo_pago', 's.nombre as servicio', 'tps.id as id_tipo_pago', 's.id as id_servicio')
                ->leftJoin('tipo_pagos_servicios as tps', 'pps.tipo_pago', '=', 'tps.id')
                ->leftJoin('servicios as s', 'pps.servicio', '=', 's.id')
                ->where('pps.cliente', $id)
                ->orderByDesc('pps.fecha_pago')
                ->first();
            $fecha = new DateTime();
            return $ultimopago ? $ultimopago : ["precio" => '0.00', "fecha_pago" =>  $fecha->format('Y-m-d H:i:s'), 'id_servicio' => 1];
        } catch (\Exception $e) {
            return null;
        }
    }

    public function create(Cliente $cliente): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        $fecha = new DateTime();
        if ($user_rol == $this->admin) {
            $servicios = Servicio::where('activo', true)->get();
            $ultimoPago = $this->ultimo_pago($cliente->id);
            $tipo_pagos = TipoPagoServicio::all();
            return Inertia::render('PagoServicios/Create', [
                'fecha' => $fecha->format('Y-m-d'), 'cliente' => $cliente, 'servicios' => $servicios, 'tipo_pagos' => $tipo_pagos, 'ultimoPago' => $ultimoPago]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }
    public function obtener_precios(Servicio $servicio, TipoPagoServicio $tipo_pago): JsonResponse
    {
        $precio = PrecioServicio::where('servicio', $servicio->id)->where('tipo_pago', $tipo_pago->id)->first();
        return response()->json(['precio' => $precio->precio]);
    }
    public function store(Request $request): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol === (int)$this->admin) {
            $request->validate([
                'cliente' => 'required|exists:clientes,id',
                'servicio' => 'required|exists:servicios,id',
                'tipo_pago' => 'required|exists:tipo_pagos_servicios,id',
                'fecha_pago' => 'required|date',
                'precio' => 'required|numeric|min:0',
                'fecha_vencimiento' => 'required|date',
                'fecha_ingreso' => 'required|date',
            ]);

            DB::beginTransaction();

            try {
                $fecha_pago = new DateTime($request->fecha_pago);
                $fecha_ingreso = new DateTime($request->fecha_ingreso);
                $fecha_vencimiento = new DateTime($request->fecha_vencimiento);
                $pago = PagoServicio::create([
                    'cliente' => $request->cliente,
                    'servicio' => $request->servicio,
                    'tipo_pago' => $request->tipo_pago,
                    'fecha_pago' => $fecha_pago->format('Y-m-d'),
                    'precio' => $request->precio,
                    'fecha_vencimiento' => $fecha_vencimiento->format('Y-m-d')
                ]);
                $cliente = Cliente::find($request->cliente);
                $servicio = Servicio::find($request->servicio);
                $tipo_pago = TipoPagoServicio::find($request->tipo_pago);
                Ingresos::create([
                    'categoria' => 1,
                    'fecha' => $fecha_ingreso->format('Y-m-d'),
                    'total' => $request->precio,
                    'descripcion' => "Pago de servicio correspondiente a $cliente->nombre por concepto del servicio $servicio->nombre $tipo_pago->nombre",
                    'id_pago_servicio' => $pago->id
                ]);
                DB::commit();
                return redirect()->route('pago_servicios.index', ['cliente' => $request->cliente])
                    ->with('success', 'Pago registrado correctamente.');
            } catch (\Exception $e) {
                DB::rollBack();
                return back()->withErrors(['error' => 'Ocurrió un error al registrar el pago: ' . $e->getMessage()]);
            }
        }

        return Inertia::render('NoPermissions');
    }

    public function edit(PagoPersonal $pagoPersonal): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $personales = Personal::all(); // Obtener registros de personal para seleccionar
            return Inertia::render('PagoServicios/Edit', ['pagoPersonal' => $pagoPersonal, 'personales' => $personales]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function update(Request $request, PagoPersonal $pagoPersonal): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'personal' => 'required|exists:personals,id', // Validar que el personal exista
                'fecha_pago' => 'required|date',
                'monto' => 'required|numeric|min:0',
                'descripcion' => 'nullable|string|max:255',
            ]);

            // Formatear las fechas para que se guarden en formato 'Y-m-d'
            $fecha_pago = new DateTime($request->fecha_pago);
            $fecha_pago_formatted = $fecha_pago->format('Y-m-d');

            // Actualizar el registro de pago personal
            $pagoPersonal->update([
                'fecha_pago' => $fecha_pago_formatted,
                'monto' => $request->monto,
                'descripcion' => $request->descripcion,
            ]);

            return redirect()->route('pago_personal.index')->with('success', 'Pago actualizado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }


    public function destroy(PagoPersonal $pagoPersonal): RedirectResponse
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $pagoPersonal->delete(); // Eliminar el registro de pago personal
            return redirect()->route('pago_personal.index')->with('success', 'Pago eliminado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }
}
