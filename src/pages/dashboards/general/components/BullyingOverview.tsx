import React from 'react';
import { AlertTriangle, Shield, Users, Activity } from 'lucide-react';

interface BullyingOverviewProps {
  data: {
    totalCases?: number;
    criticalCases?: number;
    bullyingRate?: number;
    rolesDistribution?: {
      victimas?: number;
      agresores?: number;
      observadores?: number;
      otros?: number;
    };
  };
}

/**
 * Componente que muestra un resumen de los indicadores de bullying
 */
const BullyingOverview: React.FC<BullyingOverviewProps> = ({ data }) => {
  const { totalCases = 0, criticalCases = 0, bullyingRate = 0, rolesDistribution = {} } = data;
  const { victimas = 0, agresores = 0, observadores = 0, otros = 0 } = rolesDistribution;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Bullying</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">Casos Totales</h4>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalCases}</p>
          <p className="text-sm text-gray-600">Situaciones identificadas</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-gray-800">Casos Críticos</h4>
          </div>
          <p className="text-2xl font-bold text-red-700">{criticalCases}</p>
          <p className="text-sm text-gray-600">Requieren atención inmediata</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-gray-800">Índice de Bullying</h4>
          </div>
          <p className="text-2xl font-bold text-amber-700">{bullyingRate}%</p>
          <p className="text-sm text-gray-600">Prevalencia en el grupo</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-800">Intervenciones</h4>
          </div>
          <p className="text-2xl font-bold text-green-700">0</p>
          <p className="text-sm text-gray-600">Acciones realizadas</p>
        </div>
      </div>
      
      <h4 className="font-medium text-gray-800 mb-3">Distribución de Roles</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-sm text-gray-600">Víctimas</p>
          <p className="text-xl font-semibold text-red-600">{victimas}</p>
        </div>
        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-sm text-gray-600">Agresores</p>
          <p className="text-xl font-semibold text-amber-600">{agresores}</p>
        </div>
        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-sm text-gray-600">Observadores</p>
          <p className="text-xl font-semibold text-blue-600">{observadores}</p>
        </div>
        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-sm text-gray-600">Otros</p>
          <p className="text-xl font-semibold text-gray-600">{otros}</p>
        </div>
      </div>
    </div>
  );
};

export default BullyingOverview;