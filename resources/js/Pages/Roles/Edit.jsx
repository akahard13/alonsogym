import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ role }) {
    const { data, setData, put, errors } = useForm({
        nombre: role.nombre || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    return (
        <div>
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
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Actualizar
                </button>
            </form>
        </div>
    );
}
