import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CohesionGrupalChartProps {
  data: {
    valor: number;
    categoria: string;
  };
}

/**
 * Componente para mostrar la cohesión grupal promedio en un gráfico tipo velocímetro
 */
const CohesionGrupalChart: React.FC<CohesionGrupalChartProps> = ({ data }) => {
  // Determinar color según el valor
  const getColor = (valor: number) => {
    if (valor >= 75) return '#4CAF50'; // Verde - Muy alta
    if (valor >= 50) return '#8BC34A'; // Verde claro - Óptima
    if (valor >= 25) return '#FFC107'; // Amarillo - Baja
    return '#F44336'; // Rojo - Muy baja
  };

  const color = getColor(data.valor);
  
  // Datos para el gráfico
  const chartData = [
    { name: 'Valor', value: data.valor },
    { name: 'Restante', value: 100 - data.valor }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-4 text-center">Cohesión Grupal Promedio</h3>
      <div className="flex flex-col items-center">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell key="cell-0" fill={color} />
                <Cell key="cell-1" fill="#EEEEEE" />
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Cohesión']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <div className="text-3xl font-bold" style={{ color }}>{data.valor}%</div>
          <div className="text-lg font-medium mt-2">{data.categoria}</div>
          <div className="text-sm text-gray-600 mt-1">
            {data.valor >= 75 ? 'Cohesión muy alta' :
             data.valor >= 50 ? 'Cohesión óptima' :
             data.valor >= 25 ? 'Cohesión baja' : 'Cohesión muy baja'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohesionGrupalChart;
