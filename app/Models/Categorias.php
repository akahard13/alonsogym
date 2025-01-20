<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorias extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = ['nombre', 'icono', 'ingreso', 'egreso'];

    public function egresos()
    {
        return $this->hasMany(Egresos::class, 'categoria');
    }

    public function ingresos()
    {
        return $this->hasMany(Ingresos::class, 'categoria');
    }
}
