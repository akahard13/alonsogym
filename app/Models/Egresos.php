<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Egresos extends Model
{
    use HasFactory;

    protected $fillable = ['descripcion', 'fecha', 'categoria', 'total', 'id_pago_personal'];

    public function categoria()
    {
        return $this->belongsTo(Categorias::class, 'categoria');
    }
}

