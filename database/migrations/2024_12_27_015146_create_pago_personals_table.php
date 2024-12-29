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
        Schema::create('pagos_personal', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('personal') // Llave foránea hacia la tabla personal
                ->constrained('personal')
                ->onDelete('cascade'); // Elimina los pagos si el personal asociado es eliminado
            $table->decimal('monto', 10, 2); // Monto del pago (máximo 10 dígitos y 2 decimales)
            $table->timestamp('fecha_pago'); // Fecha y hora del pago
            $table->text('descripcion')->nullable(); // Descripción del pago (opcional)
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
        Schema::dropIfExists('pagos_personal');
    }
};
