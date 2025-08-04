<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Premios extends Model
{
    protected $table = 'premios';

    protected $fillable = [
        'id', 'user_id', 'puntos', 'nombre'
    ];
    public $timestamps = true;
}
