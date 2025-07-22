import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { IoMdWoman } from "react-icons/io";
import { IoManSharp } from "react-icons/io5";

export default function Dashboard({ info, finanzas }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                {/* Clientes Generales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-gray-700 text-center text-3xl">Clientes Generales</h3>
                        <div className="flex flex-row justify-around mt-4 mb-4 text-center text-2xl">
                            <p className="text-blue-500 font-semibold flex flex-row items-center"><IoManSharp className='w-12 h-12' /> {info.clientes_generales.masculino}</p>
                            <p className="text-pink-500 font-semibold flex flex-row items-center"><IoMdWoman className='w-16 h-16' /> {info.clientes_generales.femenino}</p>
                        </div>
                        <p className="font-semibold flex justify-center text-2xl bg-blue-300 rounded-3xl p-2">Total: {info.clientes_generales.total}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-gray-700 text-center text-3xl">Clientes Activos</h3>
                        <div className="flex flex-row justify-around mt-4 mb-4 text-2xl">
                            <p className="text-blue-500 font-semibold flex flex-row items-center"><IoManSharp className='w-12 h-12' /> {info.clientes_activos.masculino}</p>
                            <p className="text-pink-500 font-semibold flex flex-row items-center"><IoMdWoman className='w-16 h-16' /> {info.clientes_activos.femenino}</p>
                        </div>
                        <p className="font-semibold flex justify-center text-2xl bg-blue-300 rounded-3xl p-2">Total: {info.clientes_activos.total}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
                        <h3 className="font-bold text-gray-700 text-center text-3xl">Finanzas del mes</h3>
                        <div className="flex flex-col sm:flex-row justify-around mt-4 mb-4 text-xl gap-4 sm:gap-0">
                            <p className="text-green-500 font-semibold flex flex-row items-center"><span className='text-black mr-2'>Ingresos:</span> C$ {finanzas.ingresos}</p>
                            <p className="text-red-500 font-semibold flex flex-row items-center"><span className='text-black mr-2'>Egresos:</span>C$ {finanzas.egresos}</p>
                        </div>
                        <p className="font-semibold flex justify-center text-xl bg-blue-300 rounded-3xl p-2 mt-8"><span className='text-black mr-2'>Ganancias:</span>C$ {finanzas.ganancia}</p>
                    </div>
                </div>

                {/* Clientes Activos por Plan */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Clientes Activos por Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {info.clientes_activos_planes.map((plan, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-gray-800 text-center text-3xl">{plan.nombre_servicio}</h4>
                                <div className="flex flex-row justify-around mt-4 mb-4 text-2xl">
                                    <p className="text-blue-500 font-semibold flex flex-row items-center"><IoManSharp className='w-12 h-12' /> {plan.total_masculino}</p>
                                    <p className="text-pink-500 font-semibold flex flex-row items-center"><IoMdWoman className='w-16 h-16' /> {plan.total_femenino}</p>
                                </div>
                                <p className="font-semibold flex justify-center text-2xl bg-blue-300 rounded-3xl p-2">Total: {plan.total}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
