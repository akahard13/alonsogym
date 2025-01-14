import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import React, { useState } from 'react'
import { AdminRol } from '@/Info/Roles';
import { IoPersonSharp } from "react-icons/io5";

const Main = ({ information, ultimoPago, pagos, auth }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };
    const handleConfirm = () => {
        destroy(route('pago_servicio.destroy', selectedId));
        setShowModal(false);
    };
    const { flash } = usePage().props;
    const rol = auth.user.rol;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pagos de Servicios
                </h2>
            }>
            <Head title="Pagos de Servicios" />
            {rol === AdminRol && (
                <Link
                    href={route('pago_servicios.create', information.id)}
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Nuevo Pago
                </Link>
            )}
            {flash.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">{flash.success}</div>}
            {flash.permission && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">{flash.permission}</div>}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-600 rounded-full w-14 h-14 flex items-center justify-center">
                                <IoPersonSharp className="h-10 w-10 text-gray-200" />
                            </div>
                            <div className="ms-4">
                                <div className="text-sm font-medium text-gray-900">{information.nombre}</div>
                                <div className="text-xs text-gray-500">{information.fecha_nacimiento}</div>
                                <div className="text-xs text-gray-500">{information.genero.nombre}</div>
                                <div className="text-xs text-gray-500">Código: {information.codigo}</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
                                    {ultimoPago && ultimoPago.fecha_pago && !isNaN(new Date(ultimoPago.fecha_pago)) && (
                                        <div className="mt-2 text-sm text-gray-700">
                                            <div className="font-semibold">Último Pago:</div>
                                            <div className="border-b border-gray-400">
                                                <span className="font-medium"></span>{' '}
                                                {new Intl.DateTimeFormat('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }).format(new Date(ultimoPago.fecha_pago))}
                                            </div>
                                            <div className="border-b border-gray-400">
                                                <span className="font-medium"></span> {ultimoPago.servicio}
                                            </div>
                                            <div className="border-b border-gray-400">
                                                <span className="font-medium"></span> {ultimoPago.tipo_pago}
                                            </div>
                                            <div >
                                                <span className="font-medium"></span> C$ {ultimoPago.precio}
                                            </div>
                                        </div>
                                    )}

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {pagos && pagos.length > 0 && (
                pagos.map((pago) => (
                    <div key={pago.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <div className="ms-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                                                Fecha de Pago: {new Intl.DateTimeFormat('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }).format(new Date(pago.fecha_pago))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ms-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">
                                                Servicio: {pago.servicio.nombre} - {pago.tipo_pago.nombre}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ms-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-200 text-blue-800">
                                                Precio: {pago.precio}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            Vence: {new Intl.DateTimeFormat('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            }).format(new Date(pago.fecha_vencimiento))}
                                        </span>
                                    </div>
                                    {/*<div className="flex-shrink-0 ms-4">
                                        <button
                                            onClick={() => handleDeleteClick(pago.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </AuthenticatedLayout>
    );
};

export default Main;
