import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface EstatusSociometricoChartProps {
  data: {
    populares: number;
    promedio: number;
    aislados: number;
    rechazados: number;
    controvertidos: number;
  };
}

/**
 * Componente para mostrar el estatus sociométrico promedio en un gráfico de barras vertical
 */
const EstatusSociometricoChart: React.FC<EstatusSociometricoChartProps> = ({ data }) => {
  // Convertir datos para el gráfico
  const chartData = [
    { name: 'Populares', value: Math.round(data.populares), color: '#0088FE' },
    { name: 'Promedio', value: Math.round(data.promedio), color: '#00C49F' },
    { name: 'Aislados', value: Math.round(data.aislados), color: '#FFBB28' },
    { name: 'Rechazados', value: Math.round(data.rechazados), color: '#FF8042' },
    { name: 'Controvertidos', value: Math.round(data.controvertidos), color: '#8884d8' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-4 text-center">Estatus Sociométrico Promedio</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              label={{ 
                value: 'Porcentaje (%)', 
                position: 'insideBottom',
                offset: -5
              }} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Porcentaje" 
              radius={[0, 4, 4, 0]} // Bordes redondeados
              barSize={30} // Ancho de las barras
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstatusSociometricoChart;
