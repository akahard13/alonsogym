<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Egresos;
use App\Models\Ingresos;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PHPUnit\TextUI\Output\NullPrinter;

class DashboardController extends Controller
{
    protected $admin;

    public function __construct()
    {
        date_default_timezone_set('America/Managua');
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index()
    {
        $info = $this->getInformation();
        $finanzas = $this->getFinanzas();
        return Inertia::render('Dashboard', ['info' => $info, 'finanzas' => $finanzas]);
    }

    private function getInformation(): array
    {
        $masculinoCount = Cliente::whereHas('genero', function ($query) {
            $query->where('id', 1);
        })->count();

        $femeninoCount = Cliente::whereHas('genero', function ($query) {
            $query->where('id', 2);
        })->count();
        $clientesActivos = $this->obtenerClientesActivosPorGenero();
        return [
            'clientes_generales' => [
                'masculino' => $masculinoCount,
                'femenino' => $femeninoCount,
            ],
            'clientes_activos' => $clientesActivos,
            'clientes_activos_planes' => $this->obtenerClientesActivosPorGenero(true)
        ];
    }

    private function obtenerClientesActivosPorGenero($filtrarxplan = false): array
    {
        $clientes = DB::table('clientes as cli')
            ->join('pago_servicios as ps', 'cli.id', '=', 'ps.cliente')
            ->join('generos as g', 'cli.genero', '=', 'g.id')
            ->join('servicios as s', 'ps.servicio', '=', 's.id')
            ->select(
                'cli.id',
                'cli.nombre',
                'cli.codigo',
                'ps.fecha_pago',
                'ps.fecha_vencimiento',
                'g.nombre as genero',
                'g.id as genero_id',
                's.nombre as servicio',
                's.id as servicio_id',
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
            ->whereRaw('NOW()::date <= ps.fecha_vencimiento::date') // Solo clientes activos
            ->orderBy('dias_restantes_numerico', 'asc')
            ->get();

        if ($filtrarxplan) {
            $resultados = [];

            // Agrupar clientes por servicio
            $servicios = $clientes->groupBy('servicio_id');

            foreach ($servicios as $servicioId => $grupo) {
                $nombreServicio = $grupo->first()->servicio;
                $varonesCount = $grupo->where('genero_id', 1)->count();
                $mujeresCount = $grupo->where('genero_id', 2)->count();

                $resultados[] = [
                    'nombre_servicio' => $nombreServicio,
                    'total_masculino' => $varonesCount,
                    'total_femenino' => $mujeresCount,
                ];
            }

            return $resultados;
        }

        $varonesCount = $clientes->where('genero_id', 1)->count();
        $mujeresCount = $clientes->where('genero_id', 2)->count();

        return [
            'masculino' => $varonesCount,
            'femenino' => $mujeresCount,
        ];
    }
    private function getFinanzas()
    {
        $mesActual = now()->month;
        $anioActual = now()->year;
        $totalIngresos = Ingresos::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $anioActual)
            ->sum('total');
        $totalEgresos = Egresos::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $anioActual)
            ->sum('total');
        return [
            'ingresos' => $totalIngresos,
            'egresos' => $totalEgresos
        ];
    }
}
