import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { CgTrash } from 'react-icons/cg';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { AdminRol } from '@/Info/Roles';
export default function Main({ auth }) {
    const { roles, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();
    const rol = auth.user.rol;
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route('roles.destroy', selectedId));
        setShowModal(false);
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
            <h1 className="text-2xl font-bold mb-4">Roles</h1>

            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {rol === AdminRol && (
                <Link
                    href={route('roles.create')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Crear Nuevo Rol
                </Link>
            )}
            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="text-left px-4 py-2">ID</th>
                        <th className="text-left px-4 py-2">Nombre</th>
                        {rol === AdminRol && (
                            <th className="text-center px-4 py-2">Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td className="text-left px-4 py-2">{role.id}</td>
                            <td className="text-left px-4 py-2">{role.nombre}</td>
                            {rol === AdminRol && (
                                <td className="flex justify-around space-x-4">
                                    <Link
                                        href={route('roles.edit', role.id)}
                                        className="mr-2 hover:text-blue-700"
                                    >
                                        <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(role.id)}
                                        className="hover:text-red-700 font-bold py-1 px-2 rounded mr-2"
                                    >
                                        <CgTrash className='w-8 h-8' title='Eliminar' />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmModal
                show={showModal}
                title="¿Estás seguro de que quieres eliminar este cliente?"
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </AuthenticatedLayout>
    );
}
