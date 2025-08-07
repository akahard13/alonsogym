import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ cliente, ultimoPago, servicios, tipo_pagos, fecha, asistencia }) => {
    const fechaVencimientoInicial = ultimoPago?.fecha_vencimiento
        ? (() => {
            const date = new Date(ultimoPago.fecha_vencimiento);
            date.setDate(date.getDate() + 1);
            return date.toISOString().slice(0, 10);
        })()
        : fecha;
    const { data, setData, post, processing, errors } = useForm({
        cliente: cliente.id,
        fecha_pago: fechaVencimientoInicial,
        servicio: ultimoPago?.id_servicio || '',
        tipo_pago: ultimoPago?.id_tipo_pago || '',
        precio: ultimoPago?.precio || '0.00',
        descuento: '0.00',
        fecha_vencimiento: '',
        fecha_ingreso: fecha
    });


    const [precio, setPrecio] = useState(ultimoPago.precio);
    const calcularFechaVencimiento = (fechaPago, tipoPago) => {
        const fecha = new Date(fechaPago);
        let fechaVencimiento = new Date(fecha);

        switch (Number(tipoPago)) {
            case 4: // Mensual
                if (fecha.getUTCMonth() === 1 && fecha.getUTCDate() === 1) {
                    fechaVencimiento.setUTCMonth(fechaVencimiento.getUTCMonth());
                    fechaVencimiento.setUTCDate(28);
                } else {
                    fechaVencimiento.setUTCMonth(fechaVencimiento.getUTCMonth() + 1);
                    fechaVencimiento.setUTCDate(fechaVencimiento.getUTCDate() - 1);
                }
                break;

            case 3: // Quincenal
                const cantidadDiasDelMes = obtenerDiasDelMes(fechaPago);
                fechaVencimiento.setDate(
                    fechaVencimiento.getDate() + (cantidadDiasDelMes === 31 ? 15 : 14)
                );
                break;

            case 2: // Semanal
                fechaVencimiento.setDate(fechaVencimiento.getDate() + 6);
                break;

            default:
                throw new Error("Tipo de pago no válido");
        }
        return fechaVencimiento.toISOString().split('T')[0];
    };

    const obtenerDiasDelMes = (fecha) => {
        const date = new Date(fecha);
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    useEffect(() => {
        if (data.fecha_pago && data.tipo_pago) {
            const nuevaFechaVencimiento = calcularFechaVencimiento(data.fecha_pago, data.tipo_pago);
            setData('fecha_vencimiento', nuevaFechaVencimiento);
        }
    }, [data.fecha_pago, data.tipo_pago]);

    // Manejar cambios en el tipo de pago y obtener el precio
    const handlePrecio = (e) => {
        const value = e.target.value;
        setData('tipo_pago', value);

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

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return; // Evitar múltiples envíos

        const fechaPago = new Date(data.fecha_pago);
        const fechaVencimiento = new Date(data.fecha_vencimiento);

        // Validar las fechas antes de enviarlas
        if (isNaN(fechaPago.getTime()) || isNaN(fechaVencimiento.getTime())) {
            console.error('Fecha inválida');
            return;
        }

        const fechaPagoUTC = new Date(Date.UTC(fechaPago.getFullYear(), fechaPago.getMonth(), fechaPago.getDate()));
        const fechaVencimientoUTC = new Date(Date.UTC(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth(), fechaVencimiento.getDate()));

        setData('fecha_pago', fechaPagoUTC.toISOString().split('T')[0]);
        setData('fecha_vencimiento', fechaVencimientoUTC.toISOString().split('T')[0]);

        post(route('pago_servicios.store'));
    };

    // Manejar cambios en el descuento
    const handleDescuentos = (e) => {
        setData('descuento', e.target.value);
        const descuento = parseFloat(e.target.value) || 0;
        const nuevoPrecio = (parseFloat(precio) || 0) - descuento;
        setData('precio', nuevoPrecio.toFixed(2));
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
                {asistencia && (
                    <div className="bg-red-100 border border-red-300 rounded-md p-4 mb-6 shadow-sm">
                        <h2 className="text-xl text-red-600 font-semibold mb-3">Alerta Última Asistencia</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <span className="block font-semibold text-gray-600">Plan activo:</span>
                                <span className={asistencia.plan_activo ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                    {asistencia.plan_activo ? 'Sí' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-600">Fecha de registro:</span>
                                <span className={asistencia.plan_activo ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{asistencia.fecha_registro}</span>
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-600">Hora de registro:</span>
                                <span className={asistencia.plan_activo ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{asistencia.hora_registro}</span>
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-600">Fecha de vencimiento:</span>
                                <span className={asistencia.plan_activo ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{asistencia.fecha_vencimiento}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="precio" className="block font-semibold mb-2">Precio</label>
                        <TextInput
                            type="number"
                            name="precio"
                            value={data.precio || ''}
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
                            value={data.descuento || ''}
                            onChange={(e) => handleDescuentos(e)}
                            className="border rounded p-3 w-full"
                            placeholder="Realiza descuentos"
                        />
                        {errors.descripcion && <div className="text-red-600 mt-1">{errors.descripcion}</div>}
                    </div>
                    <div>
                        <label htmlFor="fecha_pago" className="block font-semibold mb-2">Fecha de inicio del plan</label>
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
                    <div>
                        <label htmlFor="fecha_ingreso" className="block font-semibold mb-2">Fecha de Pago</label>
                        <TextInput
                            type="date"
                            name="fecha_ingreso"
                            value={data.fecha_ingreso}
                            onChange={(e) => setData('fecha_ingreso', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.fecha_pago && <div className="text-red-600 mt-1">{errors.fecha_pago}</div>}
                    </div>
                </div>

                <div className="flex justify-center mt-8 gap-16">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-full"
                        disabled={processing}
                    >
                        {processing ? 'Cargando...' : 'Registrar Pago'}
                    </button>
                    <Link
                        className="bg-slate-700 text-white py-2 px-6 rounded-full"
                        href={route('pago_servicios.index', { id: cliente.id })}
                        disabled={processing}
                    >
                        {processing ? 'Cargando...' : 'Ver Historial'}
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;