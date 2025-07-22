import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DinamicasAcosoChartProps {
  data: {
    fuertes: number;
    cobardes: number;
    agresivos: number;
    victimas: number;
    provocadores: number;
    recibenMania: number;
  };
}

/**
 * Componente para mostrar las dinámicas de acoso predominantes en un gráfico de barras vertical
 */
const DinamicasAcosoChart: React.FC<DinamicasAcosoChartProps> = ({ data }) => {
  // Convertir datos para el gráfico
  const chartData = [
    { name: 'Fuertes', value: Math.round(data.fuertes), color: '#8884d8' },
    { name: 'Cobardes', value: Math.round(data.cobardes), color: '#82ca9d' },
    { name: 'Agresivos', value: Math.round(data.agresivos), color: '#ffc658' },
    { name: 'Víctimas', value: Math.round(data.victimas), color: '#ff8042' },
    { name: 'Provocadores', value: Math.round(data.provocadores), color: '#a4de6c' },
    { name: 'Reciben Manía', value: Math.round(data.recibenMania), color: '#d0ed57' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-4 text-center">Dinámicas de Acoso Predominantes</h3>
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

export default DinamicasAcosoChart;
