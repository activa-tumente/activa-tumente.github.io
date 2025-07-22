import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TasasIncidenciaChartProps {
  data: {
    agresores: number;
    victimas: number;
    agresoresVictimas: number;
    otros: number;
  };
}

/**
 * Componente para mostrar las tasas de incidencia general en un gráfico circular
 */
const TasasIncidenciaChart: React.FC<TasasIncidenciaChartProps> = ({ data }) => {
  // Formatear datos para el gráfico
  const chartData = [
    { name: 'Agresores', value: Math.round(data.agresores), color: '#FF8042' },
    { name: 'Víctimas', value: Math.round(data.victimas), color: '#0088FE' },
    { name: 'Agresores-Víctimas', value: Math.round(data.agresoresVictimas), color: '#FFBB28' },
    { name: 'No Implicados', value: Math.round(data.otros), color: '#00C49F' }
  ].filter(item => item.value > 0); // Filtrar solo los valores mayores que 0

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-4 text-center">Tasas de Incidencia General</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TasasIncidenciaChart;
