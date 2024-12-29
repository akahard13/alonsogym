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
        Schema::create('personal', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('nombres'); // Nombres del personal
            $table->string('apellidos'); // Apellidos del personal
            $table->foreignId('genero') // Llave foránea hacia la tabla genero
                  ->constrained('generos')
                  ->onDelete('cascade'); // Elimina el registro si el género asociado es eliminado
            $table->string('cargo'); // Cargo del personal
            $table->string('celular'); // Número de celular del personal
            $table->date('fecha_contratacion'); // Fecha de contratación
            $table->decimal('salario', 8, 2); // Salario del personal (máximo 8 dígitos y 2 decimales)
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
        Schema::dropIfExists('personal');
    }
};
