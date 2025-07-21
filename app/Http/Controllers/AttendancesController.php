<?php

namespace App\Http\Controllers;

use App\Models\Asistencias;
use App\Models\Categorias;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendancesController extends Controller
{
    protected $admin;

    public function __construct()
    {
        date_default_timezone_set('America/Managua');
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index()
    {
        return Inertia::render('AttendancesRegister');
    }

    public function marcar(Request $request)
    {
        $request->validate([
            'codigo' => 'required|Numeric|max_digits:4|min_digits:4',
        ]);
        $cliente = Cliente::where('codigo', $request->codigo)->first();
        if ($cliente) {
            $info = $this->getInformacion($cliente->id);
            if (!$info) {
                return back()->with('permission', 'Estimado ' . $cliente->nombre . ' no tiene ningun plan activo');
            } else if ($info->dias_restantes_numerico < 0) {
                $res = $this->guardarAsistencia($cliente->id, false);
                if (!$res) {
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' usted ya tiene registrada asistencia el dia de hoy');
                }
                return back()->with('permission', 'Estimado ' . $cliente->nombre . ' se ha marcado asistencia el dia de hoy en su plan ' . $info->tipo_pago . ' que ha expirado el ' . $info->fecha_vencimiento);
            } else if ($info->dias_restantes_numerico == 0) {
                $res = $this->guardarAsistencia($cliente->id);
                if (!$res) {
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' usted ya tiene registrada asistencia el dia de hoy');
                }
                return back()->with('permission', 'Estimado ' . $cliente->nombre . 'se ha marcado asistencia el día de hoy en su plan ' . $info->tipo_pago . ' que expira hoy.');
            } else {
                $res = $this->guardarAsistencia($cliente->id);
                if (!$res) {
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' usted ya tiene registrada asistencia el dia de hoy');
                }
                return back()->with('success', 'Estimado ' . $cliente->nombre . ' se ha marcado asistencia el día de hoy en su plan ' . $info->tipo_pago . '  que expira en ' . $info->dias_restantes_numerico . ' dias el ' . $info->fecha_vencimiento);
            }
        } else {
            return back()->with('permission', 'El codigo ingresado no pertenece a ningún cliente');
        }
    }
    private function getInformacion($clienteId = null)
    {
        return DB::table('clientes as cli')
            ->join('pago_servicios as ps', function ($join) {
                $join->on('cli.id', '=', 'ps.cliente')
                    ->whereRaw('ps.fecha_pago = (SELECT MAX(sub_ps.fecha_pago) FROM pago_servicios AS sub_ps WHERE sub_ps.cliente = cli.id)');
            })
            ->join('tipo_pagos_servicios as tp', 'ps.tipo_pago', '=', 'tp.id')
            ->select('ps.fecha_pago',  'ps.fecha_vencimiento', 'tp.nombre as tipo_pago', DB::raw('(ps.fecha_vencimiento::date - NOW()::date) AS dias_restantes_numerico'))
            ->where('ps.cliente', $clienteId)->first();
    }
    private function guardarAsistencia($clienteId, $plan = true)
    {
        $cliente = Cliente::find($clienteId);
        try {
            $subquery = DB::table('pago_servicios as ps1')
                ->join(
                    DB::raw('(SELECT cliente, MAX(id) as max_id FROM pago_servicios GROUP BY cliente) as latest'),
                    'ps1.id',
                    '=',
                    'latest.max_id'
                )
                ->select('ps1.*')
                ->where('ps1.cliente', $cliente->id);

            $fecha_vencimiento = DB::table(DB::raw("({$subquery->toSql()}) as ps"))
                ->mergeBindings($subquery)
                ->get();
            $asistencias = Asistencias::where('cliente_id', $cliente->id)->where('fecha_registro', now())->first();
            if ($asistencias) {
                return false;
            } else {
                Asistencias::create([
                    'cliente_id' => $cliente->id,
                    'plan_activo' => $plan,
                    'fecha_registro' => now(),
                    "hora_registro" => now()->format('H:i:s'),
                    'fecha_vencimiento' => $fecha_vencimiento[0]->fecha_vencimiento
                ]);
                return true;
            }
        } catch (\Exception $e) {
            throw new \Exception($e, 1);
        }
    }

    public function informeAsistencias()
    {
        $user_rol = Auth::user()->rol;
        $fecha = now()->format('Y-m-d');
        if ($user_rol == $this->admin) {
            $asistencias = DB::table('asistencias as a')
                ->join('clientes as c', 'a.cliente_id', '=', 'c.id')
                // ->leftJoin(DB::raw('
                //     (
                //         SELECT ps1.*
                //         FROM pago_servicios ps1
                //         INNER JOIN (
                //             SELECT cliente, MAX(id) as max_id
                //             FROM pago_servicios
                //             GROUP BY cliente
                //         ) latest ON ps1.id = latest.max_id
                //     ) as ps
                // '), 'ps.cliente', '=', 'c.id')
                ->select(
                    'a.id',
                    'c.id  as cliente_id',
                    'c.nombre as nombre_completo',
                    'c.codigo',
                    'a.hora_registro',
                    'a.plan_activo',
                    DB::raw("TO_CHAR(a.fecha_registro, 'DD/MM/YYYY') as fecha_asistencia"),
                    'a.fecha_vencimiento',
                    //DB::raw("case when a.fecha_vencimiento is null then ps.fecha_vencimiento else a.fecha_vencimiento end as fecha_vencimiento")
                )
                ->where('a.fecha_registro', '=', $fecha)
                ->orderByDesc('a.fecha_registro')
                ->orderBy('a.hora_registro', 'desc')
                ->get();
            return Inertia::render('Asistencias/Informe', [
                'asistencias' => $asistencias,
                'defaultDate' => $fecha
            ]);
        }
        return Inertia::render('NoPermissions');
    }
    public function obtenerAsistencias(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $asistencias = DB::table('asistencias as a')
                ->join('clientes as c', 'a.cliente_id', '=', 'c.id')
                // ->leftJoin(DB::raw('
                //     (
                //         SELECT ps1.*
                //         FROM pago_servicios ps1
                //         INNER JOIN (
                //             SELECT cliente, MAX(id) as max_id
                //             FROM pago_servicios
                //             GROUP BY cliente
                //         ) latest ON ps1.id = latest.max_id
                //     ) as ps
                // '), 'ps.cliente', '=', 'c.id')
                ->select(
                    'a.id',
                    'c.id  as cliente_id',
                    'c.nombre as nombre_completo',
                    'c.codigo',
                    'a.hora_registro',
                    'a.plan_activo',
                    DB::raw("TO_CHAR(a.fecha_registro, 'DD/MM/YYYY') as fecha_asistencia"),
                    'a.fecha_vencimiento',
                    //DB::raw("case when a.fecha_vencimiento is null then ps.fecha_vencimiento else a.fecha_vencimiento end as fecha_vencimiento")
                )
                ->where('a.fecha_registro', '=', $request->fecha)
                ->orderByDesc('a.fecha_registro')
                ->orderBy('a.hora_registro', 'desc')
                ->get();
            return response()->json($asistencias);
        }
        return back()->with('permission', 'No tiene permiso para realizar estaacción');
    }
}
