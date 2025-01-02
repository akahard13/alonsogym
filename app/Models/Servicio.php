<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'servicios';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nombre',
        'activo',
    ];
    protected $attributes = [
        'activo' => true,
    ];

    public function precios()
    {
        return $this->hasMany(PrecioServicio::class, 'servicio', 'id');
    }
}
