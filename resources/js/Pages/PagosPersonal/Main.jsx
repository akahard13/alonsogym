import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { AdminRol } from '@/Info/Roles';
import { IoPersonSharp } from 'react-icons/io5';

const Main = ({ information, pagos, auth }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { delete: destroy } = useForm();

    // Función para formatear la fecha
    const formatDate = (date) => {
        const d = new Date(date + 'T00:00:00Z'); // Forzar UTC
        const day = d.getUTCDate().toString().padStart(2, '0'); // Día en UTC
        const month = (d.getUTCMonth() + 1).toString().padStart(2, '0'); // Mes en UTC
        const year = d.getUTCFullYear(); // Año en UTC
        return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        destroy(route('personal.destroy', selectedId));
        setShowModal(false);
    };

    const { flash } = usePage().props;
    const rol = auth.user.rol;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pagos Personal
                </h2>
            }
        >
            <Head title="Pagos Personal" />

            {rol === AdminRol && (
                <Link
                    href={route('pago_personal.create', information.id)}
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Nuevo pago
                </Link>
            )}

            {flash.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">
                    {flash.success}
                </div>
            )}

            {flash.permission && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">
                    {flash.permission}
                </div>
            )}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-600 rounded-full w-14 h-14 flex items-center justify-center">
                                <IoPersonSharp className="h-10 w-10 text-gray-200" />
                            </div>

                            <div className="ms-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {information.nombres} {information.apellidos}
                                </div>
                                <div className="text-xs text-gray-500">{information.cargo}</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Salario: C$ {information.salario}
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
                                                Fecha de pago: {formatDate(pago.fecha_pago)}{' '}
                                                {/* Usamos formatDate aquí */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ms-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-200 text-blue-800">
                                                Descripción: {pago.descripcion}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            Desembolso: C$ {pago.monto}
                                        </span>
                                    </div>
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