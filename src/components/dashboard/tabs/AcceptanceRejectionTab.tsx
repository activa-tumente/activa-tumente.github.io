import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AcceptanceRejectionTabProps {
  eleccionesData: any[];
  rechazosData: any[];
  interpretacionData: any;
}

const AcceptanceRejectionTab: React.FC<AcceptanceRejectionTabProps> = ({ 
  eleccionesData, 
  rechazosData, 
  interpretacionData 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elecciones Recibidas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eleccionesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="elecciones" fill="#8884d8" name="Elecciones Recibidas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rechazos Recibidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rechazosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rechazos" fill="#d88484" name="Rechazos Recibidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interpretación Sociométrica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Populares</h4>
            <p>{interpretacionData.populares.join(', ')}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800">Rechazados</h4>
            <p>{interpretacionData.rechazados.join(', ')}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Nivel de Cohesión</h4>
            <p>{interpretacionData.cohesion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceRejectionTab;