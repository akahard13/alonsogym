import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ role }) {
    const { data, setData, put, errors } = useForm({
        nombre: role.nombre || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
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
            <h1 className="text-2xl font-bold mb-4">Editar Rol</h1>

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
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Actualizar
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
