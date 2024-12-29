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
        Schema::create('pesos_clientes', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('cliente') // Llave foránea hacia la tabla clientes
                ->constrained('clientes')
                ->onDelete('cascade'); // Elimina los registros si el cliente es eliminado
            $table->decimal('peso', 5, 2); // Peso del cliente con hasta 5 dígitos y 2 decimales
            $table->timestamp('fecha_registro'); // Fecha en que se registró el peso
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
        Schema::dropIfExists('pesos_clientes');
    }
};
