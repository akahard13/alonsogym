import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ tipo_pagos }) => {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        modalidades: {}, // Almacena los datos de las modalidades
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const ids = [];
        const valores = [];
        for (const [id, valor] of Object.entries(data.modalidades)) {
            ids.push(id);
            valores.push(valor);
        }
        post(route('servicios.store'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Servicios
                </h2>
            }
        >
            <Head title="Servicios" />
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Servicio</h1>

            <form onSubmit={handleSubmit} className="m-4">
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
                <div className="mt-4">
                    <h2 className="text-lg font-medium text-gray-900">Precios del servicio por modalidades</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Cada modalidad tiene sus propias tarifas, cabe destacar que pueden haber modalidades sin tarifas.
                    </p>
                </div>
                {tipo_pagos.map((tipo) => (
                    <div key={tipo.id} className="mt-4">
                        <label htmlFor={tipo.nombre.toLowerCase()} className="block">{tipo.nombre}</label>
                        <TextInput
                            type="text"
                            name={`modalidad_${tipo.id}`}
                            value={data.modalidades[tipo.id] || ''}
                            onChange={(e) =>
                                setData('modalidades', {
                                    ...data.modalidades,
                                    [tipo.id]: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                        />
                        {errors[`modalidades.${tipo.id}`] && (
                            <div className="text-red-600">{errors[`modalidades.${tipo.id}`]}</div>
                        )}
                    </div>
                ))}
                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Creando...' : 'Crear Servicio'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;
