import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ cliente, ultimoPago, servicios, tipo_pagos }) => {
    const { data, setData, post, get, processing, errors } = useForm({
        cliente: cliente.id,
        fecha_pago: '',
        servicio: '' | ultimoPago.id_servicio,
        tipo_pago: '' | ultimoPago.id_tipo_pago,
        precio: ultimoPago.precio,
        descuento: '0.00',
        fecha_vencimiento: '', // Inicialmente vacía
    });
    const [precio, setPrecio] = useState(ultimoPago.precio);
    const handlePrecio = (e) => {
        const value = e.target.value;
        setData('tipo_pago', value);

        // Asegúrate de que los parámetros están correctamente pasados
        const url = route('pago_servicios.obtener_precio', {
            servicio: data.servicio,
            tipo_pago: value
        });

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener el precio');
                }
                return response.json();
            })
            .then((data) => {
                setPrecio(data.precio);
                setData('precio', data.precio);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pago_servicios.store'));
    };
    const handleDescuentos = (e) => {
        setData('descuento', e.target.value);
        const descuento = parseFloat(e.target.value) || 0; // Convertir el valor a número (o 0 si está vacío)
        const nuevoPrecio = (parseFloat(precio) || 0) - descuento; // Restar el descuento
        setData('precio', nuevoPrecio.toFixed(2)); // Actualizar precio con 2 decimales
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pagos clientes
                </h2>
            }
        >
            <Head title="Pagos clientes" />
            <h1 className="text-2xl font-bold mb-6 text-center">Registrar nuevo pago cliente</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cliente, Plan, y Modalidad */}
                    <div>
                        <label htmlFor="clientel" className="block font-semibold mb-2">Cliente</label>
                        <select
                            name="cliente"
                            value={data.cliente}
                            onChange={(e) => setData('cliente', e.target.value)}
                            className="border rounded p-3 w-full"
                            disabled={true}
                        >
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        </select>
                        {errors.cliente && <div className="text-red-600 mt-1">{errors.cliente}</div>}
                    </div>
                    <div>
                        <label htmlFor="servicios" className="block font-semibold mb-2">Plan:</label>
                        <select
                            name="servicios"
                            value={data.servicio}
                            onChange={(e) => setData('servicio', e.target.value)}
                            className="border rounded p-3 w-full"
                        >
                            <option value="">-- Seleccione --</option>
                            {servicios && servicios.map((servicio) => (
                                <option key={servicio.id} value={servicio.id}>
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.servicio && <div className="text-red-600 mt-1">{errors.servicio}</div>}
                    </div>
                    <div>
                        <label htmlFor="tipo_pago" className="block font-semibold mb-2">Modalidad:</label>
                        <select
                            name="tipo_pago"
                            value={data.tipo_pago}
                            onChange={(e) => handlePrecio(e)}
                            className="border rounded p-3 w-full"
                        >
                            <option value="">-- Seleccione --</option>
                            {tipo_pagos && tipo_pagos.map((tp) => (
                                <option key={tp.id} value={tp.id}>
                                    {tp.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.tipo_pago && <div className="text-red-600 mt-1">{errors.tipo_pago}</div>}
                    </div>
                </div>

                {/* Fecha de Pago, Precio y Descuento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="precio" className="block font-semibold mb-2">Precio</label>
                        <TextInput
                            type="number"
                            name="precio"
                            value={data.precio || ''}  // Si data.precio es undefined, usa una cadena vacía
                            onChange={(e) => setData('precio', e.target.value)}
                            className="border rounded p-3 w-full"
                            disabled
                        />

                        {errors.monto && <div className="text-red-600 mt-1">{errors.monto}</div>}
                    </div>
                    <div>
                        <label htmlFor="descuento" className="block font-semibold mb-2">Descuento</label>
                        <TextInput
                            type="number"
                            name="descuento"
                            value={data.descuento || ''}  // Si data.descuento es undefined, usa una cadena vacía
                            onChange={(e) => handleDescuentos(e)}
                            className="border rounded p-3 w-full"
                            placeholder="Realiza descuentos"
                        />

                        {errors.descripcion && <div className="text-red-600 mt-1">{errors.descripcion}</div>}
                    </div>
                    <div>
                        <label htmlFor="fecha_pago" className="block font-semibold mb-2">Fecha de Pago</label>
                        <TextInput
                            type="date"
                            name="fecha_pago"
                            value={data.fecha_pago}
                            onChange={(e) => setData('fecha_pago', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.fecha_pago && <div className="text-red-600 mt-1">{errors.fecha_pago}</div>}
                    </div>
                    <div>
                        <label htmlFor="fecha_vencimiento" className="block font-semibold mb-2">Fecha de Vencimiento</label>
                        <TextInput
                            type="date"
                            name="fecha_vencimiento"
                            value={data.fecha_vencimiento}
                            onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.fecha_vencimiento && <div className="text-red-600 mt-1">{errors.fecha_vencimiento}</div>}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-cyan-900 text-white px-6 py-3 rounded hover:bg-cyan-600 font-semibold"
                    >
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>

        </AuthenticatedLayout>
    );
};

export default Create;
