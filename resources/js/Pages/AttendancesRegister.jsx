import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const Planes = ({ clientes, auth }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        codigo: '',
    });

    const [loading, setLoading] = useState(false);
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(!!flash.success);
    const [showPermission, setShowPermission] = useState(!!flash.permission);
    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.permission) {
            setShowPermission(true);
            const timer = setTimeout(() => {
                setShowPermission(false);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [flash.permission]);


    // useEffect(() => {
    //     if (data.codigo.length === 4) {
    //         marcarAsistencia();
    //     }
    // }, [data.codigo]);
    const marcarAsistencia = () => {
        if (!data.codigo) {
            alert("Debes ingresar un código antes de marcar asistencia");
            return;
        }

        setLoading(true);
        post(route('asistencias.marcar'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('codigo');
            },
            onFinish: () => setLoading(false),
        });
    }
    const handleMarcarAsistencia = (e) => {
        e.preventDefault();
        marcarAsistencia();
    };

    const handleNumericClick = (num) => {
        if (data.codigo.length < 4) {
            setData('codigo', data.codigo + num);
        }
    };

    const handleClear = () => {
        reset('codigo');
    };

    return (
        <GuestLayout>
            <Head title="Marcar Asistencia" />
            <div className="my-4">
                {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700  px-6 py-4 rounded mb-4 mt-4 relative">
                        <button onClick={() => setShowSuccess(false)} className="h-8 border border-green-400 w-8 absolute right-2 top-2 text-lg">&times;</button>
                        {flash.success}
                    </div>
                )}
                {showPermission && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-4 mt-4 relative">
                        <button onClick={() => setShowPermission(false)} className="h-8 border border-red-400 w-8 absolute right-2 top-2 text-lg">&times;</button>
                        {flash.permission}
                    </div>
                )}


                {/* Formulario de asistencia */}
                <form onSubmit={handleMarcarAsistencia}>
                    <input
                        type="text"
                        name="codigo"
                        placeholder="Buscar por nombre, código o ID"
                        value={data.codigo}
                        onChange={(e) => setData('codigo', e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        maxLength={4}
                    />
                    {errors.codigo && <div className="text-red-600 mt-1">{errors.codigo}</div>}

                    <div className="grid grid-cols-3 gap-2 mt-4 max-w-xs mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                            <button
                                type="button"
                                key={num}
                                onClick={() => handleNumericClick(num)}
                                className="py-2 bg-cyan-900 text-white rounded text-lg hover:bg-cyan-700"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={handleClear}
                            className="py-2 bg-red-500 text-white rounded text-lg hover:bg-red-400"
                        >
                            Borrar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || loading}
                            className="py-2 bg-green-600 text-white rounded text-lg hover:bg-green-500"
                        >
                            {loading ? "Marcando..." : "Marcar"}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
};

export default Planes;
