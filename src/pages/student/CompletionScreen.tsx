import React from 'react';
    import { Link } from 'react-router-dom';
    import { CheckCircle } from 'lucide-react';

    const CompletionScreen: React.FC = () => {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-semibold mb-3 text-gray-800">¡Gracias!</h2>
          <p className="text-gray-600 mb-6">
            Has completado el cuestionario exitosamente. Tus respuestas han sido guardadas.
          </p>
          <Link
            to="/student" // Link back to group selection
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Volver a Selección de Grupo
          </Link>
           <Link
            to="/" // Link back to home
            className="mt-3 px-6 py-2 text-sm text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out"
          >
            Ir a la Página Principal
          </Link>
        </div>
      );
    };

    export default CompletionScreen;
