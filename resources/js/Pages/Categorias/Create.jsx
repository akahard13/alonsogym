import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        //icono: '',
        ingreso:false,
        egreso:false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categorias.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categorías
                </h2>
            }
        >
            <Head title="Crear Categoría" />
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Categoría</h1>
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

                {/* <div>
                    <label htmlFor="icono" className="block">Ícono</label>
                    <TextInput
                        type="text"
                        name="icono"
                        value={data.icono}
                        onChange={(e) => setData('icono', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.icono && <div className="text-red-600">{errors.icono}</div>}
                </div> */}
                <div className='flex gap-4 flex-row mt-4 items-center '>
                    <label htmlFor="ingreso" className="block">Ingreso:</label>
                    <Checkbox
                        name="ingreso"
                        checked={data.ingreso}
                        onChange={(e) => setData('ingreso', e.target.checked)}
                        className="border p-3 w-1/24"
                    />
                    {errors.ingreso && <div className="text-red-600">{errors.ingreso}</div>}
                    <label htmlFor="egreso" className="block">Egreso:</label>
                    <Checkbox
                        name="egreso"
                        checked={data.egreso}
                        onChange={(e) => setData('egreso', e.target.checked)}
                        className="border p-3 w-1/24"
                    />
                    {errors.egreso && <div className="text-red-600">{errors.egreso}</div>}
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Creando...' : 'Crear Categoría'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;
