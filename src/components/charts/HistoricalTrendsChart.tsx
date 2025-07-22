import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoricalTrendsChartProps {
  data: {
    months: string[];
    bullyingIndex: number[];
    victimizationIndex: number[];
  };
}

/**
 * Componente para mostrar tendencias históricas de bullying
 */
const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ data }) => {
  // Formatear datos para el gráfico
  const chartData = data.months.map((month, index) => ({
    month,
    bullying: Math.round(data.bullyingIndex[index] * 100),
    victimization: Math.round(data.victimizationIndex[index] * 100)
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value}%`, '']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="bullying"
            name="Índice de Bullying"
            stroke="#FF8042"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="victimization"
            name="Índice de Victimización"
            stroke="#0088FE"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalTrendsChart;
