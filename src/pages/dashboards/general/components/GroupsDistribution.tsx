import React from 'react';
import { Users, School, BookOpen } from 'lucide-react';

interface Group {
  id: string;
  nombre: string;
  grado?: string;
  año_escolar?: string;
  total_estudiantes?: number;
  institucion_nombre?: string;
}

interface GroupsDistributionProps {
  groups: Group[];
  onSelectGroup?: (groupId: string) => void;
}

/**
 * Componente que muestra la distribución de grupos y permite seleccionar uno
 */
const GroupsDistribution: React.FC<GroupsDistributionProps> = ({ groups, onSelectGroup }) => {
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución de Grupos</h3>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">No hay grupos disponibles para mostrar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución de Grupos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div 
            key={group.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => onSelectGroup && onSelectGroup(group.id)}
          >
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-800">{group.nombre}</h4>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {group.institucion_nombre && (
                <div className="flex items-center">
                  <School className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{group.institucion_nombre}</span>
                </div>
              )}
              
              {group.grado && (
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Grado: {group.grado}</span>
                </div>
              )}
              
              {group.año_escolar && (
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Año escolar: {group.año_escolar}</span>
                </div>
              )}
              
              {group.total_estudiantes !== undefined && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Estudiantes: {group.total_estudiantes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsDistribution;