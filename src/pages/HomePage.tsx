
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="flex flex-col items-center justify-center p-6 pt-10">
        <div className="bg-white shadow-xl rounded-lg px-8 py-8 w-[1240px] text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/images/Bull-S.jpg"
              alt="Cuestionario BULL-S"
              className="h-auto rounded shadow-sm"
              style={{ width: '1200px' }}
            />
          </div>
          <p className="text-gray-700 mb-6 text-lg">
            ¡Bienvenido/a! Por favor, selecciona tu rol para comenzar.
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <Link
              to="/auth/student"
              className="flex items-center justify-center w-1/4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out text-base font-medium shadow-sm"
            >
              <Users className="mr-2 h-5 w-5" />
              Soy Estudiante
            </Link>

            <Link
              to="/auth/admin"
              className="flex items-center justify-center w-1/4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out text-base font-medium shadow-sm"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Soy Administrador/a
            </Link>

            <Link
              to="/auth/serverless"
              className="flex items-center justify-center w-1/4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out text-base font-medium shadow-sm"
            >
              <Shield className="mr-2 h-5 w-5" />
              Funciones Serverless
            </Link>
          </div>
        </div>
        <footer className="mt-8 text-sm text-gray-500">
          BullsApp-Enhanced &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default HomePage;

