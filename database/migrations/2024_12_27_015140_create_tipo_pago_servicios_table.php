<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tipo_pagos_servicios', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('nombre'); // Nombre del tipo de pago
            $table->timestamps(); // Campos created_at y updated_at
        });
        DB::table('tipo_pagos_servicios')->insert([
            ['nombre' => 'Día', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Semanal', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Quincenal', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Mensual', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_pagos_servicios');
    }
};
