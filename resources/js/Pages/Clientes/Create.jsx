import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ generos }) => {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        fecha_nacimiento: '',
        celular: '',
        genero: '',
        huella: '',
        codigo: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('clientes.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Cliente</h1>
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
                    <label htmlFor="fecha_nacimiento" className="block">Fecha de Nacimiento</label>
                    <TextInput
                        type="date"
                        name="fecha_nacimiento"
                        value={data.fecha_nacimiento}
                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.fecha_nacimiento && <div className="text-red-600">{errors.fecha_nacimiento}</div>}
                </div>

                <div>
                    <label htmlFor="celular" className="block">Celular</label>
                    <TextInput
                        type="text"
                        name="celular"
                        value={data.celular}
                        onChange={(e) => setData('celular', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.celular && <div className="text-red-600">{errors.celular}</div>}
                </div>

                <div>
                    <label htmlFor="genero" className="block">Género</label>
                    <select
                        name="genero"
                        value={data.genero}
                        onChange={(e) => setData('genero', e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">Selecciona un género</option>
                        {generos.map((genero) => (
                            <option key={genero.id} value={genero.id}>
                                {genero.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.genero && <div className="text-red-600">{errors.genero}</div>}
                </div>

                <div>
                    <label htmlFor="codigo" className="block">Código</label>
                    <TextInput
                        type="text"
                        name="codigo"
                        value={data.codigo}
                        onChange={(e) => setData('codigo', e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.codigo && <div className="text-red-600">{errors.codigo}</div>}
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Creando...' : 'Crear Cliente'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;
