import React from 'react';
import { Brain } from 'lucide-react';

const Dimension1Tab = ({ eleccionesData, rechazosData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Elecciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Elecciones Recibidas</h3>
          <p className="text-sm text-gray-600 mb-4">Estudiantes más elegidos como compañeros</p>
          <div className="space-y-2">
            {eleccionesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{item.nombre}</span>
                  <span className="text-sm text-gray-600 ml-2">({item.grupo})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{item.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rechazos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Rechazos Recibidos</h3>
          <p className="text-sm text-gray-600 mb-4">Estudiantes más rechazados como compañeros</p>
          <div className="space-y-2">
            {rechazosData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{item.nombre}</span>
                  <span className="text-sm text-gray-600 ml-2">({item.grupo})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-red-600">{item.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 text-blue-500 mr-2" />
          Interpretación Sociométrica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-green-400 pl-4">
            <h4 className="font-medium text-green-800">Estudiantes Populares</h4>
            <p className="text-sm text-gray-600 mt-1">Alta aceptación, bajo rechazo</p>
            <ul className="mt-2 text-sm text-gray-700">
              <li>• Raffaella Barrios (25% elecciones)</li>
              <li>• María José Cañas (20% elecciones)</li>
              <li>• Isabella Moreno (17% elecciones)</li>
            </ul>
          </div>
          <div className="border-l-4 border-red-400 pl-4">
            <h4 className="font-medium text-red-800">Estudiantes Rechazados</h4>
            <p className="text-sm text-gray-600 mt-1">Alto rechazo, baja aceptación</p>
            <ul className="mt-2 text-sm text-gray-700">
              <li>• Paulina Bermúdez (50% rechazos)</li>
              <li>• Isabella León (22% rechazos)</li>
              <li>• Luciana Ríos (15% rechazos)</li>
            </ul>
          </div>
          <div className="border-l-4 border-yellow-400 pl-4">
            <h4 className="font-medium text-yellow-800">Nivel de Cohesión</h4>
            <p className="text-sm text-gray-600 mt-1">Evaluación grupal</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                BAJO
              </span>
              <p className="text-sm text-gray-700 mt-1">Formación de subgrupos aislados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dimension1Tab;