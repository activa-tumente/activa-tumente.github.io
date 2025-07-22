import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Acceso Denegado | BULLS</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Ir al Dashboard
            </button>
            {user?.role === 'Administrador' && (
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Ir al Panel de Administración
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
