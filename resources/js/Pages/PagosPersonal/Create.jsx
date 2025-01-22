import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';

const Create = ({ persona }) => {
    const { data, setData, post, processing, errors } = useForm({
        personal: persona.id,
        fecha_pago: '',
        monto: '0.00',
        descripcion: '', // Inicialmente vacía
        salario: false,
    });

    // Función para manejar el cambio del checkbox
    const handleSalarioChange = (e) => {
        const checked = e.target.checked;
        setData('salario', checked);
        if (checked) {
            setData('monto', persona.salario);
            setData('descripcion', `Pago de salario correspondiente a ${persona.nombres} ${persona.apellidos}`);
        } else {
            setData('monto', '0.00');
            setData('descripcion', '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pago_personal.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pago Personal
                </h2>
            }
        >
            <Head title="Pago Personal" />
            <h1 className="text-2xl font-bold mb-6 text-center">Registrar nuevo pago personal</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="personal" className="block font-semibold mb-2">Personal</label>
                        <select
                            name="personal"
                            value={data.personal}
                            onChange={(e) => setData('personal', e.target.value)}
                            className="border rounded p-3 w-full" disabled={true}
                        >
                            <option key={persona.id} value={persona.id}>
                                {persona.nombres} {persona.apellidos}
                            </option>
                        </select>
                        {errors.personal && <div className="text-red-600 mt-1">{errors.personal}</div>}
                    </div>
                    <div>
                        <label htmlFor="fecha_pago" className="block font-semibold mb-2">Fecha de Pago</label>
                        <TextInput
                            type="date"
                            name="fecha_pago"
                            value={data.fecha_pago}
                            onChange={(e) => setData('fecha_pago', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.fecha_pago && <div className="text-red-600 mt-1">{errors.fecha_pago}</div>}
                    </div>
                    <div>
                        <label htmlFor="monto" className="block font-semibold mb-2">Monto</label>
                        <TextInput
                            type="number"
                            name="monto"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            className="border rounded p-3 w-full"
                        />
                        {errors.monto && <div className="text-red-600 mt-1">{errors.monto}</div>}
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="block font-semibold mb-2">Descripción</label>
                        <TextInput
                            type="text"
                            name="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="border rounded p-3 w-full"
                            placeholder="Descripción del pago"
                        />
                        {errors.descripcion && <div className="text-red-600 mt-1">{errors.descripcion}</div>}
                    </div>
                    <div className="col-span-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="salario"
                                checked={data.salario}
                                onChange={handleSalarioChange}
                                className="mr-2 rounded-md w-6 h-6"
                            />
                            <label htmlFor="salario" className="font-semibold">Marcar si es pago de salario</label>
                        </div>
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
