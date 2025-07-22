import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Layout title="Mi Perfil | BULLS">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-800 text-white">
          <h3 className="text-lg leading-6 font-medium">
            Información de Perfil
          </h3>
          <p className="mt-1 max-w-2xl text-sm">
            Detalles personales y de acceso
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Rol</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.active ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactivo
                  </span>
                )}
              </dd>
            </div>
            
            {user.institucion_id && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Institución</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {/* Aquí podrías mostrar el nombre de la institución si lo tienes disponible */}
                  ID: {user.institucion_id}
                </dd>
              </div>
            )}
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Permisos</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <span 
                      key={permission} 
                      className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
