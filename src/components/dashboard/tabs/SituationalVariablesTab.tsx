import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SituationalVariablesTabProps {
  formasAgresionData: any[];
  lugaresAgresionData: any[];
  frecuenciaAgresionData: any[];
}

const SituationalVariablesTab: React.FC<SituationalVariablesTabProps> = ({ 
  formasAgresionData, 
  lugaresAgresionData, 
  frecuenciaAgresionData 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Agresión</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formasAgresionData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#82ca9d" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lugares de Agresión</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lugaresAgresionData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#ffc658" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frecuencia de Agresiones</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={frecuenciaAgresionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#ff8042" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SituationalVariablesTab;