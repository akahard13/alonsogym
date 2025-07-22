<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoServicio extends Model
{
    use HasFactory;
    protected $table = 'pago_servicios';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $fillable = [
        'cliente',
        'servicio',
        'tipo_pago',
        'precio',
        'fecha_pago',
        'fecha_vencimiento',
        'activo'
    ];
    protected $casts = [
        'fecha_pago' => 'date:Y-m-d',
        'created_at' => 'date:Y-m-d',
        'updated_at' => 'date:Y-m-d',
    ];
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente', 'id');
    }
    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio', 'id');
    }
    public function tipoPago()
    {
        return $this->belongsTo(TipoPagoServicio::class, 'tipo_pago', 'id');
    }
}
