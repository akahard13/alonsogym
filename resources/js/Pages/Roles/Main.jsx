import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Main() {
    const { roles, flash } = usePage().props;
    console.log(roles, flash);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Roles</h1>

            {flash.success && <div className="text-green-600 mb-4">{flash.success}</div>}

            <Link
                href="/roles/create"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Crear Nuevo Rol
            </Link>

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td className="border px-4 py-2">{role.id}</td>
                            <td className="border px-4 py-2">{role.nombre}</td>
                            <td className="border px-4 py-2">
                                <Link
                                    href={`/roles/${role.id}/edit`}
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Editar
                                </Link>
                                <form
                                    method="POST"
                                    action={`/roles/${role.id}`}
                                    onSubmit={(e) => {
                                        if (!confirm('¿Seguro que deseas eliminar este rol?')) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="inline"
                                >
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <button
                                        type="submit"
                                        className="text-red-500 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
