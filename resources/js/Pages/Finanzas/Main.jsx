import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { CgTrash } from "react-icons/cg";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AdminRol } from '@/Info/Roles';
import ConfirmModal from '@/Components/ConfirmModal';

const Main = ({ datos, auth, editar, eliminar, create, titulo, fecha }) => {
    const rol = auth.user.rol;
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(fecha);
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();
    const { flash } = usePage().props;
    const filteredDatos = datos.filter((dato) => {
        const descripcion = dato.descripcion || '';
        const categoria = dato.categoria.nombre || '';
        const fecha = new Date(dato.fecha);
        const matchesSearchTerm =
            descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoria.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtrado por fecha
        const matchesStartDate = startDate ? fecha >= new Date(startDate) : true;
        const matchesEndDate = endDate ? fecha <= new Date(endDate) : true;

        return matchesSearchTerm && matchesStartDate && matchesEndDate;
    });

    // Sumar los totales visibles
    const totalSum = filteredDatos.reduce((acc, dato) => acc + parseFloat(dato.total || 0), 0);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route(eliminar, selectedId));
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {titulo}
                </h2>
            }
        >
            <Head title={titulo} />
            {rol === AdminRol && (
                <Link
                    href={route(create)}
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Nuevo
                </Link>
            )}
            {/* Campo de búsqueda */}
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Buscar por descripción o categoría"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
            </div>

            {/* Filtro de fechas */}
            <div className="my-4 flex space-x-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="Fecha de inicio"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    placeholder="Fecha de fin"
                />
            </div>

            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {flash.permission && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">{flash.permission}</div>}

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="text-left px-4 py-2">Descripción</th>
                        <th className="text-left px-4 py-2">Fecha</th>
                        <th className="text-left px-4 py-2">Categoría</th>
                        <th className="text-right px-4 py-2">Total</th>
                        {rol === AdminRol && (<th className="text-center px-4 py-2">Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filteredDatos.length > 0 ? (
                        filteredDatos.map((dato, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{dato.descripcion}</td>
                                <td className="px-4 py-2">{dato.fecha}</td>
                                <td className="px-4 py-2">{dato.categoria.nombre}</td>
                                <td className="px-4 py-2 text-right">{dato.total}</td>
                                {rol === AdminRol && (
                                    <td className="flex justify-around space-x-4">
                                        <Link
                                            href={route(editar, dato.id)}
                                            className="text-cyan-900 mr-2 hover:text-blue-700"
                                        >
                                            <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(dato.id)}
                                            className="text-cyan-900 hover:text-red-700 font-bold py-1 px-2 rounded mr-2"
                                        >
                                            <CgTrash className='w-8 h-8' title='Eliminar' />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center px-4 py-2">
                                No se encontraron datos.
                            </td>
                        </tr>
                    )}
                </tbody>
                {/* Fila de totales */}
                <tfoot>
                    <tr className="bg-gray-100">
                        <td colSpan="3" className="text-left px-4 py-2 font-bold">Total</td>
                        <td className="text-right px-4 py-2 font-bold">{totalSum.toFixed(2)}</td>
                        {rol === AdminRol && <td className="px-4 py-2"></td>}
                    </tr>
                </tfoot>
            </table>

            <ConfirmModal
                show={showModal}
                title="¿Estás seguro de que quieres eliminarlo?"
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </AuthenticatedLayout>
    );
};

export default Main;
