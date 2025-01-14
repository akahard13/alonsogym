import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ generos }) => {
    const { data, setData, post, processing, errors } = useForm({
        nombres: '',
        apellidos: '',
        cargo: '',
        genero: '',
        celular: '',
        codigo: '',
        fecha_contratacion: '',
        salario: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('personal.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Personal
                </h2>
            }
        >
            <Head title="Personal" />
            <h1 className="text-2xl font-bold mb-6 text-center">Agregar nuevo miembro del personal</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nombres" className="block font-semibold mb-2">Nombre</label>
                        <TextInput
                            type="text"
                            name="nombres"
                            value={data.nombres}
                            onChange={(e) => setData('nombres', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.nombres && <div className="text-red-600 mt-1">{errors.nombres}</div>}
                    </div>
                    <div>
                        <label htmlFor="apellidos" className="block font-semibold mb-2">Apellidos</label>
                        <TextInput
                            type="text"
                            name="apellidos"
                            value={data.apellidos}
                            onChange={(e) => setData('apellidos', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.apellidos && <div className="text-red-600 mt-1">{errors.apellidos}</div>}
                    </div>
                    <div>
                        <label htmlFor="celular" className="block font-semibold mb-2">Celular</label>
                        <TextInput
                            type="text"
                            name="celular"
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.celular && <div className="text-red-600 mt-1">{errors.celular}</div>}
                    </div>
                    <div>
                        <label htmlFor="genero" className="block font-semibold mb-2">Género</label>
                        <select
                            name="genero"
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            className="border rounded p-3 w-full"
                        >
                            <option value="">Selecciona un género</option>
                            {generos.map((genero) => (
                                <option key={genero.id} value={genero.id}>
                                    {genero.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.genero && <div className="text-red-600 mt-1">{errors.genero}</div>}
                    </div>
                    <div>
                        <label htmlFor="cargo" className="block font-semibold mb-2">Cargo</label>
                        <TextInput
                            type="text"
                            name="cargo"
                            value={data.cargo}
                            onChange={(e) => setData('cargo', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.cargo && <div className="text-red-600 mt-1">{errors.cargo}</div>}
                    </div>
                    <div>
                        <label htmlFor="salario" className="block font-semibold mb-2">Salario</label>
                        <TextInput
                            type="number"
                            name="salario"
                            value={data.salario}
                            onChange={(e) => setData('salario', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.salario && <div className="text-red-600 mt-1">{errors.salario}</div>}
                    </div>
                    <div>
                        <label htmlFor="fecha_contratacion" className="block font-semibold mb-2">Fecha de contratación</label>
                        <TextInput
                            type="date"
                            name="fecha_contratacion"
                            value={data.fecha_contratacion}
                            onChange={(e) => setData('fecha_contratacion', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.fecha_contratacion && <div className="text-red-600 mt-1">{errors.fecha_contratacion}</div>}
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-cyan-900 text-white px-6 py-3 rounded hover:bg-cyan-600 font-semibold"
                    >
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default Create;
