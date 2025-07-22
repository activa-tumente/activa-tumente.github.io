import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Dimension2Tab = ({ bullyingRolesData }) => {
  return (
    <div className="space-y-6">
      {/* Perfil de Roles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Roles de Bullying</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bullyingRolesData.map((estudiante, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{estudiante.estudiante}</h4>
              <p className="text-sm text-gray-600 mb-2">Grupo: {estudiante.grupo}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Fuerte:</span>
                  <span className="font-medium text-blue-600">{estudiante.fuerte}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Maltrato:</span>
                  <span className="font-medium text-red-600">{estudiante.maltrato}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Víctima:</span>
                  <span className="font-medium text-green-600">{estudiante.victima}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cobarde:</span>
                  <span className="font-medium text-yellow-600">{estudiante.cobarde}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Agresores Identificados</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Isabella León (6B)</p>
                <p className="text-sm text-gray-600">33% fuerte, 33% maltrato, 33% provocación</p>
              </div>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mía Cardozo (6B)</p>
                <p className="text-sm text-gray-600">33% fuerte, 22% maltrato, 22% provocación</p>
              </div>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Víctimas Identificadas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Paulina Bermúdez (6A)</p>
                <p className="text-sm text-gray-600">55% cobarde, 20% víctima, 35% manía</p>
              </div>
              <TrendingDown className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">María Paula Amaya (6B)</p>
                <p className="text-sm text-gray-600">33% cobarde, 11% víctima</p>
              </div>
              <TrendingDown className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dimension2Tab;