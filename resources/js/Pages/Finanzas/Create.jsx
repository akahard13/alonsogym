import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Create = ({ categorias, auth, store }) => {
    const { data, setData, post, processing, errors } = useForm({
        descripcion: '',
        fecha: '',
        categoria: '',
        total: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(store)); // Ruta para almacenar el nuevo ingreso
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Finanzas
                </h2>
            }
        >
            <Head title='Crear Datos Financieros' />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6 bg-white shadow-md p-6 rounded-md">
                <div className="mb-4">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <input
                        id="descripcion"
                        type="text"
                        value={data.descripcion}
                        onChange={(e) => setData('descripcion', e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                        Fecha
                    </label>
                    <input
                        id="fecha"
                        type="date"
                        value={data.fecha}
                        onChange={(e) => setData('fecha', e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    {errors.fecha && <p className="text-red-600 text-sm">{errors.fecha}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <select
                        id="categoria_id"
                        value={data.categoria}
                        onChange={(e) => setData('categoria', e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                        <option value="" disabled>
                            Selecciona una categoría
                        </option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.categoria && <p className="text-red-600 text-sm">{errors.categoria}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="total" className="block text-sm font-medium text-gray-700">
                        Total
                    </label>
                    <input
                        id="total"
                        type="number"
                        step="0.01"
                        value={data.total}
                        onChange={(e) => setData('total', e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    {errors.total && <p className="text-red-600 text-sm">{errors.total}</p>}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 focus:outline-none"
                    >
                        Crear Ingreso
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;
