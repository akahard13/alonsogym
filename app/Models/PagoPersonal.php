<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PagoPersonal extends Model
{
    protected $table = 'pagos_personal';
    protected $primaryKey = 'id';
    protected $fillable = [
        'personal',
        'fecha_pago',
        'monto',
        'descripcion',
    ];

    public function personal()
    {
        return $this->belongsTo(Personal::class, 'personal', 'id');
    }
}
