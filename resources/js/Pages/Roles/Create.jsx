import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        nombre: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />
            <h1 className="text-2xl font-bold mb-4">Crear Rol</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        className="border rounded px-4 py-2 w-full"
                    />
                    {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Guardar
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
