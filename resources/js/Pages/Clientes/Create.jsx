import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
const Create = ({ generos, servicios, tipo_pagos }) => {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        fecha_nacimiento: '',
        celular: '',
        genero: '',
        huella: '',
        codigo: '',
        servicio: '',
        precio: '0.00',
        tipo_pago: '',
        descuentos: '',
        fecha_pago: '',
        fecha_vencimiento: '',
    });
    const calcularFechaVencimiento = (fechaPago, tipoPago) => {
        const fecha = new Date(fechaPago);
        let fechaVencimiento = new Date(fecha);

        switch (Number(tipoPago)) {
            case 4: // Mensual
                if (fecha.getMonth() === 1 && fecha.getUTCDate() === 1) {
                    fechaVencimiento.setUTCMonth(fechaVencimiento.getUTCMonth());
                    fechaVencimiento.setUTCDate(28);
                }
                else {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('clientes.store'));
    };
    const [precio, setPrecio] = useState(0.00);
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


    const handleSubmitPago = (e) => {
        e.preventDefault();
        post(route('clientes.pago'));
    };
    const handleDescuentos = (e) => {
        setData('descuento', e.target.value);
        const descuento = parseFloat(e.target.value) || 0; // Convertir el valor a número (o 0 si está vacío)
        const nuevoPrecio = (parseFloat(precio)) - descuento; // Restar el descuento
        setData('precio', nuevoPrecio.toFixed(2)); // Actualizar precio con 2 decimales
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nuevo Cliente
                </h2>
            }
        >
            <Head title="Nuevo Cliente" />
            <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Cliente</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primer formulario */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
                    <div>
                        <label htmlFor="nombre" className="block">Nombre</label>
                        <TextInput
                            type="text"
                            name="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.nombre && <div className="text-red-600">{errors.nombre}</div>}
                    </div>

                    <div>
                        <label htmlFor="fecha_nacimiento" className="block">Fecha de Nacimiento</label>
                        <TextInput
                            type="date"
                            name="fecha_nacimiento"
                            value={data.fecha_nacimiento}
                            onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.fecha_nacimiento && <div className="text-red-600">{errors.fecha_nacimiento}</div>}
                    </div>

                    <div>
                        <label htmlFor="celular" className="block">Celular</label>
                        <TextInput
                            type="text"
                            name="celular"
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.celular && <div className="text-red-600">{errors.celular}</div>}
                    </div>

                    <div>
                        <label htmlFor="genero" className="block">Género</label>
                        <select
                            name="genero"
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="">Selecciona un género</option>
                            {generos.map((genero) => (
                                <option key={genero.id} value={genero.id}>
                                    {genero.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.genero && <div className="text-red-600">{errors.genero}</div>}
                    </div>

                    <div>
                        <label htmlFor="codigo" className="block">Código</label>
                        <TextInput
                            type="text"
                            name="codigo"
                            value={data.codigo}
                            onChange={(e) => setData('codigo', e.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.codigo && <div className="text-red-600">{errors.codigo}</div>}
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-cyan-900 text-white px-6 py-3 rounded hover:bg-cyan-600 font-semibold"
                        >
                            {processing ? 'Creando...' : 'Crear Cliente'}
                        </button>
                    </div>
                </form>

                {/* Segundo formulario */}
                <form onSubmit={handleSubmitPago} className="bg-white shadow-md rounded p-6">
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

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-cyan-900 text-white px-6 py-3 rounded hover:bg-cyan-600 font-semibold"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
