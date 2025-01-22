import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { CgTrash } from "react-icons/cg";
import ConfirmModal from '@/Components/ConfirmModal';
import { AdminRol } from '@/Info/Roles';

const Main = ({ categorias, auth }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route('categorias.destroy', selectedId));
        setShowModal(false);
    };

    const { flash } = usePage().props;
    const isAdmin = auth.user.rol === AdminRol;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categorías
                </h2>
            }
        >
            <Head title="Categorías" />

            {isAdmin && (
                <Link
                    href={route('categorias.create')}
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Nueva Categoría
                </Link>
            )}

            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {flash.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">{flash.error}</div>}

            <table className="w-full mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="text-left px-4 py-2">ID</th>
                        <th className="text-left px-4 py-2">Nombre</th>
                        {/* <th className="text-left px-4 py-2">Ícono</th> */}
                        {isAdmin && (<th className="text-center px-4 py-2">Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {categorias && categorias.map((categoria) => (
                        <tr key={categoria.id} className="items-center">
                            <td className="text-left px-4 py-2">{categoria.id}</td>
                            <td className="text-left px-4 py-2">{categoria.nombre}</td>
                            {/* <td className="text-left px-4 py-2">{categoria.icono}</td> */}
                            {isAdmin && categoria.id !== 1 && categoria.id !== 2 && (
                                <td className="flex justify-around space-x-4">
                                    <Link
                                        href={route('categorias.edit', categoria.id)}
                                        className="text-cyan-900 mr-2 hover:text-blue-700"
                                    >
                                        <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(categoria.id)}
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

            <ConfirmModal
                show={showModal}
                title="¿Estás seguro de que quieres eliminar esta categoría?"
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </AuthenticatedLayout>
    );
};

export default Main;
