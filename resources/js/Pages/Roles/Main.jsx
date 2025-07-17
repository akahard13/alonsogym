import React, { use, useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { CgTrash } from 'react-icons/cg';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { AdminRol } from '@/Info/Roles';
export function Main({ auth }) {
    const { roles, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();
    const rol = auth.user.rol;
    const permissionBuilt = false;
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route('roles.destroy', selectedId));
        setShowModal(false);
    };
    return (
        <div>
            <div className="max-w-xl text-justify">
                <h2 className="text-lg font-medium text-gray-900">Roles</h2>
                <p className="mt-1 text-sm text-gray-600">
                    This is a reminder that you can create others roles, but for now, they have no permissions and only function as 'Invitado'
                    since we only provide privileges to the 'Administrador'.
                </p>
            </div>
            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {rol === AdminRol && permissionBuilt && (
                <div className="flex justify-end">
                    <Link
                        href={route('roles.create')}
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Nuevo
                    </Link>
                </div>
            )}
            <div className="w-full overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-500 overflow-scroll mt-4 border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="text-left px-4 py-2">ID</th>
                            <th className="text-left px-4 py-2">Nombre</th>
                            {rol === AdminRol && permissionBuilt && (
                                <th className="text-center px-4 py-2">Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="text-left px-4 py-2">{role.id}</td>
                                <td className="text-left px-4 py-2">{role.nombre}</td>
                                {rol === AdminRol && permissionBuilt && (
                                    <td className="flex justify-around space-x-4">
                                        <Link
                                            href={route('roles.edit', role.id)}
                                            className="text-cyan-900 mr-2 hover:text-blue-700"
                                        >
                                            <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(role.id)}
                                            className="text-cyan-900 hover:text-red-700 font-bold py-1 px-2 rounded mr-2"
                                        >
                                            <CgTrash className='w-8 h-8' title='Eliminar' />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmModal
                show={showModal}
                title="¿Estás seguro de que quieres eliminar este cliente?"
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
