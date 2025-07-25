import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { CgTrash } from "react-icons/cg";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AdminRol } from '@/Info/Roles';
import ConfirmModal from '@/Components/ConfirmModal';
const Planes = ({ clientes, auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    //const clientesArray = Array.isArray(clientes) ? clientes : Object.values(clientes);
    const clientesArray = Array.isArray(clientes) ? clientes : Object.values(clientes || {});

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
    const filteredClientes = clientesArray.filter((cliente) =>
        cliente && cliente.nombre && cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente && cliente.codigo && cliente.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente && cliente.id && cliente.id.toString().includes(searchTerm)
    );
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
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Nuevo Cliente
                </Link>
            )}
            {/* Campo de búsqueda */}
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
            </div>
            <div className="w-full overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-500 overflow-scroll mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="text-left px-4 py-2 ">ID</th>
                            <th className="text-left px-4 py-2">Nombre</th>
                            <th className="text-left px-4 py-2 ">Género</th>
                            <th className="text-left px-4 py-2">Código</th>
                            <th className="text-left px-4 py-2">Servicio</th>
                            <th className="text-left px-4 py-2">Fecha de vencimiento</th>
                            <th className="text-left px-4 py-2 ">Restantes</th>
                            {rol === AdminRol && (<th className="text-center px-4 py-2">Acciones</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.length > 0 ? (
                            filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="items-center">
                                    <td className="text-left px-4 py-2 ">{cliente.id}</td>
                                    <td className="text-left px-4 py-2">{cliente.nombre}</td>
                                    <td className="text-left px-4 py-2 ">{cliente.genero}</td>
                                    <td className="text-left px-4 py-2">{cliente.codigo}</td>
                                    <td className="text-left px-4 py-2">{cliente.servicio}</td>
                                    {/* <td className="text-left px-4 py-2">
                                        {new Intl.DateTimeFormat('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            timeZone: 'UTC'  // 👈 Fuerza el formato UTC
                                        }).format(new Date(cliente.fecha_vencimiento + 'Z'))}


                                    </td> */}
                                    <td className="text-left px-4 py-2">
                                        {cliente.fecha_vencimiento}
                                    </td>
                                    <td className="text-left px-4 py-2">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${cliente.estado ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {cliente.dias_restantes_numerico < 0 ? 'Vencido' : cliente.dias_restantes}
                                        </span>

                                    </td>
                                    {rol === AdminRol && (
                                        <td className="flex justify-around space-x-4">
                                            <Link href={route('pago_servicios.create', cliente.id)}
                                                className="text-cyan-900 hover:text-green-700"
                                            >
                                                <RiMoneyDollarCircleLine className='w-8 h-8' title='Pagar' />
                                            </Link>
                                            <Link
                                                href={route('clientes.edit', cliente.id)}
                                                className="text-cyan-900 mr-2 hover:text-blue-700"
                                            >
                                                <HiOutlinePencilSquare className='w-8 h-8' title='Editar' />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(cliente.id)}
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
                                <td colSpan="6" className="text-center text-gray-500 py-4">
                                    No se encontraron resultados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ConfirmModal
                show={showModal}
                title="¿Estás seguro de que quieres eliminar este cliente?"
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </AuthenticatedLayout>
    );
};

export default Planes;
