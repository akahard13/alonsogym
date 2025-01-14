import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Edit = ({ categoria }) => {
    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre || '',
        icono: categoria.icono || '',
    });

    useEffect(() => {
        // Pre-cargar los datos de la categoría en el formulario
        setData({
            nombre: categoria.nombre,
            icono: categoria.icono,
        });
    }, [categoria]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('categorias.update', categoria.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categorías
                </h2>
            }
        >
            <Head title="Editar Categoría" />
            <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre" className="block">Nombre</label>
                    <TextInput
                        type="text"
                        name="nombre"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.nombre && <div className="text-red-600">{errors.nombre}</div>}
                </div>

                <div>
                    <label htmlFor="icono" className="block">Ícono</label>
                    <TextInput
                        type="text"
                        name="icono"
                        value={data.icono}
                        onChange={(e) => setData('icono', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.icono && <div className="text-red-600">{errors.icono}</div>}
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Actualizando...' : 'Actualizar Categoría'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Edit;
