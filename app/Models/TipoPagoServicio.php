<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoPagoServicio extends Model
{
    protected $table = 'tipo_pagos_servicios';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nombre'
    ];
    
}
