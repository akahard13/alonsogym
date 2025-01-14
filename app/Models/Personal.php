<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personal extends Model
{
    protected $table = 'personal';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nombres',
        'apellidos',
        'genero',
        'cargo',
        'celular',
        'fecha_contratacion',
        'salario',
    ];
    public function genero()
    {
        return $this->belongsTo(Genero::class, 'genero', 'id');
    }
    public function personal()
    {
        return $this->hasMany(Personal::class, 'personal', 'id');
    }
}
