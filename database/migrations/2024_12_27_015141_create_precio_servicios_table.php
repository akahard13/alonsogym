<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('precios_servicios', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('servicio') // Foreign key hacia la tabla servicios
                ->constrained('servicios')
                ->onDelete('cascade'); // Elimina los precios si el servicio se elimina
            $table->foreignId('tipo_pago') // Foreign key hacia la tabla tipo_pagos_servicios
                ->constrained('tipo_pagos_servicios')
                ->onDelete('cascade'); // Elimina los precios si el tipo de pago se elimina
            $table->decimal('precio', 8, 2); // Precio con hasta 8 dígitos y 2 decimales
            $table->timestamps(); // Campos created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('precios_servicios');
    }
};
