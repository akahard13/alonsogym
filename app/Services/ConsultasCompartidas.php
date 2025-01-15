<?php

use Illuminate\Support\Facades\DB;

class ConsultasCompartidas
{
    public function __construct(){}
    public function ultimo_pago($id)
    {
        try {
            $ultimopago = DB::table('pago_servicios as pps')
                ->select('pps.*', 'tps.nombre as tipo_pago', 's.nombre as servicio', 'tps.id as id_tipo_pago', 's.id as id_servicio')
                ->leftJoin('tipo_pagos_servicios as tps', 'pps.tipo_pago', '=', 'tps.id')
                ->leftJoin('servicios as s', 'pps.servicio', '=', 's.id')
                ->where('fecha_pago', function ($query) use ($id) {
                    $query->selectRaw('MAX(fecha_pago)')
                        ->from('pago_servicios')
                        ->where('cliente', $id);
                })
                ->first();
            return $ultimopago ? $ultimopago : ["precio" => '0.00'];
        } catch (\Exception $e) {
            return null;
        }
    }
}