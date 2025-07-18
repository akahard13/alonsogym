<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencias extends Model
{
    protected $table = 'asistencias';
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'plan_activo',
        'fecha_registro',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
