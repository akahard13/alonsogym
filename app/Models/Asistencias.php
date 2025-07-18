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
    protected $casts = [
        'fecha_registro' => 'date:Y-m-d',
    ];
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
