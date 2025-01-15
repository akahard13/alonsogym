import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

// Función para transformar el array
const transformData = (precios) => {
    return precios.reduce((acc, item) => {
        acc[item.tipo_pago.id] = item.precio;
        return acc;
    }, {});
};

const Edit = ({ servicio, precios }) => {
    const { data, setData, put, processing, errors } = useForm({
        nombre: servicio.nombre,
        modalidades: transformData(precios), // Inicializar modalidades con los datos transformados
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('servicios.update', servicio.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Servicio
                </h2>
            }
        >
            <Head title="Editar Servicio" />
            <h1 className="text-2xl font-bold mb-4">Editar Servicio</h1>

            <form onSubmit={handleSubmit} className="m-4">
                <div>
                    <label htmlFor="nombre" className="block">Nombre</label>
                    <TextInput
                        type="text"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={(e) => setData('nombre', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.nombre && <div className="text-red-600">{errors.nombre}</div>}
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-medium text-gray-900">Precios del servicio por modalidades</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Cada modalidad tiene sus propias tarifas, puedes dejar algunas modalidades sin tarifas.
                    </p>
                </div>

                {Object.entries(data.modalidades).map(([tipoId, precio]) => {
                    const tipoPago = precios.find((p) => p.tipo_pago.id.toString() === tipoId)?.tipo_pago || {};
                    return (
                        <div key={tipoId} className="mt-4">
                            <label htmlFor={tipoPago.nombre?.toLowerCase()} className="block">
                                {tipoPago.nombre || 'Desconocido'}
                            </label>
                            <TextInput
                                type="text"
                                name={tipoPago.nombre?.toLowerCase()}
                                value={precio}
                                onChange={(e) =>
                                    setData('modalidades', {
                                        ...data.modalidades,
                                        [tipoId]: e.target.value,
                                    })
                                }
                                className="border p-2 w-full"
                            />
                        </div>
                    );
                })}

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Actualizando...' : 'Actualizar Servicio'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Edit;
