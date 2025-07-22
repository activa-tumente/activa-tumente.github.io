import React from 'react';
    import { Link } from 'react-router-dom';
    import { AlertTriangle } from 'lucide-react';

    const NotFoundPage: React.FC = () => {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Página No Encontrada</h1>
          <p className="text-lg text-gray-600 mb-6">
            ¡Ups! La página que buscas no existe.
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Volver al Inicio
          </Link>
        </div>
      );
    };

    export default NotFoundPage;
