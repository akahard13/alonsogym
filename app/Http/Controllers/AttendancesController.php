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
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index()
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            return Inertia::render('AttendancesRegister');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function marcar(Request $request)
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'codigo' => 'required|Numeric|max_digits:4|min_digits:4',
            ]);
            $cliente = Cliente::where('codigo', $request->codigo)->first();
            if ($cliente) {
                $info = $this->getInformacion($cliente->id);
                if (!$info) {
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' no tiene ningun plan activo');
                } else if ($info->dias_restantes_numerico < 0) {
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' su plan ' . $info->tipo_pago . ' ha expirado el ' . $info->fecha_vencimiento);
                } else if ($info->dias_restantes_numerico == 0) {
                    $res = $this->guardarAsistencia($cliente->id);
                    if (!$res) {
                        return back()->with('permission', 'Estimado ' . $cliente->nombre . ' usted ya tiene registrada asistencia el dia de hoy');
                    }
                    return back()->with('permission', 'Estimado ' . $cliente->nombre . ' su plan ' . $info->tipo_pago . ' expira hoy.');
                } else {
                    $res = $this->guardarAsistencia($cliente->id);
                    if (!$res) {
                        return back()->with('permission', 'Estimado ' . $cliente->nombre . ' usted ya tiene registrada asistencia el dia de hoy');
                    }
                    return back()->with('success', 'Estimado ' . $cliente->nombre . ' su plan ' . $info->tipo_pago . ' expira en ' . $info->dias_restantes_numerico . ' dias el ' . $info->fecha_vencimiento);
                }
            } else {
                return back()->with('permission', 'El codigo ingresado no pertenece a ningún cliente');
            }
        }
        return back()->with('permission', 'No tiene permiso para realizar estaacción');
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
    private function guardarAsistencia($clienteId)
    {
        $cliente = Cliente::find($clienteId);
        try {
            $asistencias = Asistencias::where('cliente_id', $cliente->id)->where('fecha_registro', now())->first();
            if ($asistencias) {
                return false;
            } else {
                Asistencias::create([
                    'cliente_id' => $cliente->id,
                    'fecha_registro' => now()
                ]);
                return true;
            }
        } catch (\Exception $e) {
            throw new \Exception($e, 1);
        }
    }
}
