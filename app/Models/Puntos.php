<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Puntos extends Model
{
    protected $table = 'puntos';

    protected $primaryKey = 'id';

    protected $fillable = ['id', 'user_id', 'cliente', 'puntos', 'created_at', 'updated_at'];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente', 'id');
    }
}
