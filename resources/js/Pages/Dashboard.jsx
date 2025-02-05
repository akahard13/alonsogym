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
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-700">Clientes Generales</h3>
                        <p className="text-blue-500 font-semibold flex flex-row items-center align-center mb-4 mt-4"><IoManSharp className='w-8 h-8'/> {info.clientes_generales.masculino}</p>
                        <p className="text-pink-500 font-semibold flex flex-row items-center align-center"><IoMdWoman className='w-8 h-8'/> {info.clientes_generales.femenino}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-700">Clientes Activos</h3>
                        <p className="text-blue-500 font-semibold flex flex-row items-center align-center mb-4 mt-4"><IoManSharp className='w-8 h-8'/> {info.clientes_activos.masculino}</p>
                        <p className="text-pink-500 font-semibold flex flex-row items-center align-center"><IoMdWoman className='w-8 h-8'/> {info.clientes_activos.femenino}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-700">Finanzas del mes</h3>
                        <p className="text-blue-500 font-semibold flex flex-row items-center align-center mb-4 mt-4">Ingresos: C$ {finanzas.ingresos}</p>
                        <p className="text-pink-500 font-semibold flex flex-row items-center align-center">Egresos: C$ {finanzas.egresos}</p>
                    </div>
                </div>

                {/* Clientes Activos por Plan */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Clientes Activos por Plan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {info.clientes_activos_planes.map((plan, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-gray-800">{plan.nombre_servicio}</h4>
                                <p className="text-blue-500 font-semibold flex flex-row items-center align-center mb-4 mt-4"><IoManSharp className='w-8 h-8'/> {plan.total_masculino}</p>
                                <p className="text-pink-500 font-semibold flex flex-row items-center align-center"><IoMdWoman className='w-8 h-8'/> {plan.total_femenino}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
