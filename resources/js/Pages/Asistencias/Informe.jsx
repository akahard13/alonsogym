import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
const Informe = ({ asistencias: initialAsistencias, auth, defaultDate }) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(
    defaultDate ?? new Date().toISOString().slice(0, 10)
  );
  const [asistencias, setAsistencias] = useState(() =>
    Array.isArray(initialAsistencias)
      ? initialAsistencias
      : Object.values(initialAsistencias)
  );

  const [loading, setLoading] = useState(false);
  const handleDateChange = async (e) => {
    const value = e.target.value;
    setDateFilter(value);

    setLoading(true);
    try {
      const response = await fetch(`/asistencias/obtener?fecha=${value}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener asistencias');
      const data = await response.json();
      setAsistencias(Array.isArray(data) ? data : Object.values(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtradas = useMemo(() => {
    return asistencias.filter((a) =>
      (a.nombre_completo ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (a.codigo ?? '').toLowerCase().includes(search.toLowerCase()) ||
      a.id.toString().includes(search)
    );
  }, [asistencias, search]);

  const { flash } = usePage().props;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Informe de asistencias
        </h2>
      }
    >
      <Head title="Informe de asistencias" />

      {/* Mensaje flash */}
      {flash.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded my-4">
          {flash.success}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 my-4">
        <input
          type="text"
          placeholder="Buscar por nombre, código o ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 mb-2 sm:mb-0"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="w-full sm:w-48 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />
      </div>

      {/* Tabla o loader */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando asistencias…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Hora</th>
              <th className="px-4 py-2 text-left">Estado del plan</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length ? (
              filtradas.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 text-left">{a.nombre_completo}</td>
                  <td className="px-4 py-2 text-left">{a.codigo}</td>
                  <td className="px-4 py-2 text-left">
                    {a.fecha_asistencia}
                  </td>
                  <td className="px-4 py-2 text-left">{a.hora_registro}</td>
                  <td className="px-4 py-2 text-left">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-orange-100 text-orange-800}`}
                    >
                      {!a.plan_activo? 'Vencido' : 'Activo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </AuthenticatedLayout>
  );
};

export default Informe;