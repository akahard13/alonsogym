<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->date('fecha_registro');
            $table->timestamps();

            // Restricción única: cliente no puede tener más de una asistencia por día
            $table->unique(['cliente_id', 'fecha_registro']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
