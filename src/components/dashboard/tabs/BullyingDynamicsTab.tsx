import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BullyingDynamicsTabProps {
  bullyingRolesData: any[];
  agresoresData: any[];
  victimasData: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BullyingDynamicsTab: React.FC<BullyingDynamicsTabProps> = ({ 
  bullyingRolesData, 
  agresoresData, 
  victimasData 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Roles de Bullying</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={bullyingRolesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {bullyingRolesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles Específicos: Agresores</h3>
          <ul>
            {agresoresData.map((item, index) => (
              <li key={index} className="border-b py-2">{item.name} ({item.rol})</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles Específicos: Víctimas</h3>
          <ul>
            {victimasData.map((item, index) => (
              <li key={index} className="border-b py-2">{item.name} ({item.rol})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BullyingDynamicsTab;