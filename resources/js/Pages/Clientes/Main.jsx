import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { CgTrash } from "react-icons/cg";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AdminRol } from '@/Info/Roles';
import ConfirmModal from '@/Components/ConfirmModal';
const Main = ({ clientes, auth }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route('clientes.destroy', selectedId));
        setShowModal(false);
    };
    const { flash } = usePage().props;
    const rol = auth.user.rol;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Clientes
                </h2>
            }
        >
            <Head title="Clientes Totales" />
            {rol === AdminRol && (
                <Link
                    href={route('clientes.create')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Crear Nuevo Cliente
                </Link>
            )}
            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {flash.permission && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">{flash.permission}</div>}
            <table className="w-full mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="text-left px-4 py-2 hidden sm:table-cell">ID</th>
                        <th className="text-left px-4 py-2">Nombre</th>
                        <th className="text-left px-4 py-2 hidden sm:table-cell">Celular</th>
                        <th className="text-left px-4 py-2 hidden sm:table-cell">Género</th>
                        <th className="text-left px-4 py-2">Código</th>
                        {rol === AdminRol && (<th className="text-center px-4 py-2">Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id} className="items-center">
                            <td className="text-left px-4 py-2 hidden sm:table-cell">{cliente.id}</td>
                            <td className="text-left px-4 py-2">{cliente.nombre}</td>
                            <td className="text-left px-4 py-2 hidden sm:table-cell">{cliente.celular}</td>
                            <td className="text-left px-4 py-2 hidden sm:table-cell">{cliente.genero.nombre}</td>
                            <td className="text-left px-4 py-2">{cliente.codigo}</td>
                            {rol === AdminRol && (
                                <td className="flex justify-around space-x-4">
                                        <Link
                                            className=" hover:text-green-700"
                                        >
                                            <RiMoneyDollarCircleLine className='w-8 h-8' title='Pagar' />
                                        </Link>
                                        <Link
                                            href={route('clientes.edit', cliente.id)}
                                            className="mr-2 hover:text-blue-700"
                                        >
                                            <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(cliente.id)}
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
};

export default Main;