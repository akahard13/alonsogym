import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const NoPermissions = () => {
    return (
        <AuthenticatedLayout>
            <Head title="No Permissions" />
            <div className="py-12 bg-red-100 rounded p-4 shadow">
                <h1 className="text-2xl font-bold mb-4 text-red-700">Importante</h1>
                <p>No tiene permiso para realizar esta acción.</p>
            </div>
        </AuthenticatedLayout>
    )
}

export default NoPermissions