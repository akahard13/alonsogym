import React from 'react';

const ErrorPage = ({ message, error }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-lg text-gray-700 mb-4">{message}</p>
            {error && (
                <pre className="bg-gray-200 text-red-500 p-4 rounded">
                    {error}
                </pre>
            )}
            <a
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
                Regresar al inicio
            </a>
        </div>
    );
};

export default ErrorPage;
