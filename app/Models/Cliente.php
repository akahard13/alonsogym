<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'fecha_nacimiento',
        'celular',
        'genero',
        'huella',
        'codigo',
    ];

    // Relación con el modelo Genero
    public function genero()
    {
        return $this->belongsTo(Genero::class, 'genero', 'id');
    }
}
