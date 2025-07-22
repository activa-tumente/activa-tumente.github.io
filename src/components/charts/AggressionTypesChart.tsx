import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface AggressionTypeData {
  name: string;
  value: number;
  color?: string;
}

interface AggressionTypesChartProps {
  data: AggressionTypeData[];
  title?: string;
  className?: string;
}

const COLORS = {
  'Físico': '#FF8042',
  'Verbal': '#0088FE',
  'Social': '#FFBB28',
  'Cibernético': '#00C49F',
  'Exclusión': '#9966FF',
  'Intimidación': '#FF6666'
};

const AggressionTypesChart: React.FC<AggressionTypesChartProps> = ({
  data,
  title = "Tipos de Agresión",
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [minPercentage, setMinPercentage] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Filtrar datos según los filtros aplicados
  const filteredData = data.filter(item => {
    if (minPercentage > 0 && item.value < minPercentage) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(item.name)) return false;
    return true;
  });

  // Lista de todos los tipos para el filtro
  const allTypes = data.map(item => item.name);

  const handleTypeSelection = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setMinPercentage(0);
    setSelectedTypes([]);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800 text-lg">{title}</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Filtros
          {showFilters ?
            <ChevronUp className="h-3.5 w-3.5 ml-1" /> :
            <ChevronDown className="h-3.5 w-3.5 ml-1" />
          }
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor mínimo (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={minPercentage}
                onChange={(e) => setMinPercentage(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{minPercentage}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de agresión
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={selectedTypes.length === 0 || selectedTypes.includes(type)}
                      onChange={() => handleTypeSelection(type)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
            >
              Limpiar
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 40,
            }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              domain={[0, 'dataMax + 10']}
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
            <Tooltip
              formatter={(value) => [`${value}%`, 'Porcentaje']}
              contentStyle={{ borderRadius: '4px' }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar
              dataKey="value"
              name="Porcentaje"
              radius={[0, 4, 4, 0]}
              barSize={30}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[entry.name as keyof typeof COLORS] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No hay datos que cumplan con los criterios de filtrado.
        </div>
      )}

      {minPercentage > 0 && (
        <div className="text-xs text-gray-500 italic mt-2">
          * Mostrando solo tipos con un porcentaje ≥ {minPercentage}%
        </div>
      )}
    </div>
  );
};

export default AggressionTypesChart;