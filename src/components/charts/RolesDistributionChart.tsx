import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RoleData {
  name: string;
  value: number;
  color: string;
}

interface RolesDistributionChartProps {
  data: RoleData[];
}

const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

const RolesDistributionChart: React.FC<RolesDistributionChartProps> = ({ data }) => {
  const totalStudents = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} estudiantes (${((value / totalStudents) * 100).toFixed(1)}%)`, 'Cantidad']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RolesDistributionChart;
