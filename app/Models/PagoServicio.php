<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoServicio extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'pago_servicios';

    // Define the primary key if it's not 'id'
    protected $primaryKey = 'id';

    // Disable auto-increment if needed (SERIAL is equivalent to auto-increment)
    public $incrementing = true;

    // The attributes that are mass assignable
    protected $fillable = [
        'cliente',
        'servicio',
        'tipo_pago',
        'precio',
        'fecha_pago',
        'fecha_vencimiento',
        'activo'
    ];

    // The attributes that should be cast to native types
    protected $casts = [
        'fecha_pago' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship with Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente', 'id');
    }

    // Relationship with Servicio
    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio', 'id');
    }

    // Relationship with TipoPagoServicio
    public function tipoPago()
    {
        return $this->belongsTo(TipoPagoServicio::class, 'tipo_pago', 'id');
    }
}
