import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AdminRol } from '@/Info/Roles';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const roles = usePage().props.auth.user.rol;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Función para renderizar los enlaces comunes
    const renderCommonLinks = () => (
        <>
            <NavLink
                href={route('clientes.index')}
                active={route().current('clientes.index')}
            >
                Clientes
            </NavLink>
            <NavLink
                href={route('clientes.activos')}
                active={route().current('clientes.activos')}
            >
                Planes
            </NavLink>
            <NavLink
                href={route('clientes.inactivos')}
                active={route().current('clientes.inactivos')}
            >
                Vencidos
            </NavLink>
            <NavLink
                href={route('servicios.index')}
                active={route().current('servicios.index')}
            >
                Servicios
            </NavLink>
            <NavLink
                href={route('asistencias.informe')}
                active={route().current('asistencias.informe')}
            >
                Informe Asistencias
            </NavLink>
        </>
    );

    // Función para renderizar los enlaces de administrador
    const renderAdminLinks = () => (
        <>
            <NavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
            >
                Dashboard
            </NavLink>
            <NavLink
                href={route('personal.index')}
                active={route().current('personal.index')}
            >
                Personal
            </NavLink>
            <NavLink
                href={route('categorias.index')}
                active={route().current('categorias.index')}
            >
                Categorias
            </NavLink>
            <NavLink
                href={route('ingresos.index')}
                active={route().current('ingresos.index')}
            >
                Ingresos
            </NavLink>
            <NavLink
                href={route('egresos.index')}
                active={route().current('egresos.index')}
            >
                Egresos
            </NavLink>
        </>
    );

    // Función para renderizar los enlaces comunes en el navbar responsive
    const renderResponsiveCommonLinks = () => (
        <>
            <ResponsiveNavLink
                href={route('clientes.index')}
                active={route().current('clientes.index')}
            >
                Clientes
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('clientes.activos')}
                active={route().current('clientes.activos')}
            >
                Planes
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('clientes.inactivos')}
                active={route().current('clientes.inactivos')}
            >
                Vencidos
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('servicios.index')}
                active={route().current('servicios.index')}
            >
                Servicios
            </ResponsiveNavLink>
        </>
    );

    // Función para renderizar los enlaces de administrador en el navbar responsive
    const renderResponsiveAdminLinks = () => (
        <>
            <ResponsiveNavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
            >
                Dashboard
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('personal.index')}
                active={route().current('personal.index')}
            >
                Personal
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('categorias.index')}
                active={route().current('categorias.index')}
            >
                Categorias
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('ingresos.index')}
                active={route().current('ingresos.index')}
            >
                Ingresos
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('egresos.index')}
                active={route().current('egresos.index')}
            >
                Egresos
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route('asistencias.informe')}
                active={route().current('asistencias.informe')}
            >
                Informe Asistencias
            </ResponsiveNavLink>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-14 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {renderCommonLinks()}
                                {roles === AdminRol && renderAdminLinks()}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((previousState) => !previousState)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {renderResponsiveCommonLinks()}
                        {roles === AdminRol && renderResponsiveAdminLinks()}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">{children}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}