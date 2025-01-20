<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('icono')->nullable();
            $table->boolean('ingreso')->default(false);
            $table->boolean('egreso')->default(false);
            $table->timestamps();
        });

        // Insertar valores por defecto
        DB::table('categorias')->insert([
            [
                'nombre' => 'Planes',
                'icono' => '<RiMoneyDollarCircleLine className="w-8 h-8" title="Pagar" />',
                'ingreso' => true,
                'egreso' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Salarios',
                'icono' => '<RiMoneyDollarCircleLine className="w-8 h-8" title="Pagar" />',
                'ingreso' => false,
                'egreso' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('categorias');
    }
};
