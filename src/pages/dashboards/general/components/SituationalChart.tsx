import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

interface SituationalChartProps {
  data: {
    byPlace?: Array<{ name: string; value: number }>;
    byTime?: Array<{ name: string; value: number }>;
    byType?: Array<{ name: string; value: number }>;
  };
}

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Componente que muestra gráficos de situaciones de bullying según diferentes factores
 */
const SituationalChart: React.FC<SituationalChartProps> = ({ data }) => {
  const { byPlace = [], byTime = [], byType = [] } = data;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Análisis Situacional</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por lugar */}
        <div>
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">Por Lugar</h4>
          </div>
          
          {byPlace.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byPlace}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
        
        {/* Gráfico por horario */}
        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-800">Por Horario</h4>
          </div>
          
          {byTime.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
        
        {/* Gráfico por tipo de agresión */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-gray-800">Por Tipo de Agresión</h4>
          </div>
          
          {byType.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byType}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SituationalChart;