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
        Schema::create('pago_servicios', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('cliente') // Llave foránea hacia la tabla clientes
                ->constrained('clientes')
                ->onDelete('cascade'); // Elimina los pagos si el cliente se elimina
            $table->foreignId('servicio') // Llave foránea hacia la tabla servicios
                ->constrained('servicios')
                ->onDelete('cascade'); // Elimina los pagos si el servicio se elimina
            $table->foreignId('tipo_pago') // Llave foránea hacia la tabla tipo_pagos_servicios
                ->constrained('tipo_pagos_servicios')
                ->onDelete('cascade'); // Elimina los pagos si el tipo de pago se elimina
            $table->decimal('precio', 8, 2); // Precio pagado, hasta 8 dígitos y 2 decimales
            $table->timestamp('fecha_pago'); // Fecha en que se realizó el pago
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
        Schema::dropIfExists('pago_servicios');
    }
};
