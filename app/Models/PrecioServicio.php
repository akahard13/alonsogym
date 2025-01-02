<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrecioServicio extends Model
{
    protected $table = 'precios_servicios';
    protected $primaryKey = 'id';
    protected $fillable = [
        'servicio',
        'tipo_pago',
        'precio'
    ];

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio', 'id');
    }

    public function tipo_pago()
    {
        return $this->belongsTo(TipoPagoServicio::class, 'tipo_pago', 'id');
    }
}
