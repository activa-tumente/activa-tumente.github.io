import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { BarChart2, Users, Settings, FileText, CheckSquare, Heart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard | BULLS">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido, {user?.firstName}</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-800 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Has iniciado sesión como <span className="font-medium">{user?.role}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === 'Administrador' && (
              <Link to="/admin/administracion" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-blue-800" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Administración</h2>
                    <p className="text-sm text-gray-500">Gestiona usuarios, roles y permisos</p>
                  </div>
                </div>
              </Link>
            )}
            
            {(user?.role === 'Administrador' || user?.role === 'Psicologo') && (
              <Link to="/admin/dashboards" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BarChart2 className="h-6 w-6 text-purple-800" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Dashboards</h2>
                    <p className="text-sm text-gray-500">Visualiza análisis y resultados</p>
                  </div>
                </div>
              </Link>
            )}
            
            {(user?.role === 'Administrador' || user?.role === 'Psicologo') && (
              <Link to="/admin/dashboard/convivencia" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-indigo-800" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Convivencia Escolar</h2>
                    <p className="text-sm text-gray-500">Análisis de dinámicas de convivencia</p>
                  </div>
                </div>
              </Link>
            )}
            
            {(user?.role === 'Administrador' || user?.role === 'Psicologo') && (
              <Link to="/admin/estudiantes" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-800" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Estudiantes</h2>
                    <p className="text-sm text-gray-500">Gestiona información de estudiantes</p>
                  </div>
                </div>
              </Link>
            )}
            
            <Link to="/cuestionarios" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <CheckSquare className="h-6 w-6 text-orange-800" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Cuestionarios</h2>
                  <p className="text-sm text-gray-500">Accede a los cuestionarios disponibles</p>
                </div>
              </div>
            </Link>
            
            {(user?.role === 'Administrador' || user?.role === 'Psicologo') && (
              <Link to="/admin/reportes" className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-800" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Reportes</h2>
                    <p className="text-sm text-gray-500">Genera y descarga informes</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;