import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface FactoresSituacionalesChartProps {
  data: {
    formasAgresion: Record<string, number>;
    lugaresComunes: Record<string, number>;
    frecuenciaPercibida: Record<string, number>;
    gravedadPercibida: Record<string, number>;
    seguridadPercibida: Record<string, number>;
  };
}

/**
 * Componente para mostrar los factores situacionales en gráficos de barras verticales
 */
const FactoresSituacionalesChart: React.FC<FactoresSituacionalesChartProps> = ({ data }) => {
  // Convertir datos para los gráficos
  const formasAgresionData = Object.entries(data.formasAgresion).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'][index % 6]
  }));

  const lugaresData = Object.entries(data.lugaresComunes).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'][index % 6]
  }));

  const frecuenciaData = Object.entries(data.frecuenciaPercibida).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]
  }));

  const gravedadData = Object.entries(data.gravedadPercibida).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]
  }));

  const seguridadData = Object.entries(data.seguridadPercibida).map(([name, value], index) => ({
    name,
    value: Math.round(value),
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]
  }));

  // Componente de gráfico reutilizable
  const VerticalBarChart = ({ title, data }: { title: string, data: any[] }) => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 mb-2 text-center">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-4 text-center">Factores Situacionales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VerticalBarChart title="Formas de Agresión" data={formasAgresionData} />
        <VerticalBarChart title="Lugares Comunes" data={lugaresData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <VerticalBarChart title="Frecuencia Percibida" data={frecuenciaData} />
        <VerticalBarChart title="Gravedad Percibida" data={gravedadData} />
        <VerticalBarChart title="Seguridad Percibida" data={seguridadData} />
      </div>
    </div>
  );
};

export default FactoresSituacionalesChart;
