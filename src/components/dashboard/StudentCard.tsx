import React from 'react';
import { User, TrendingUp, TrendingDown, AlertTriangle, Shield, Users } from 'lucide-react';

interface StudentCardProps {
  nombre: string;
  apellido: string;
  grupo: string;
  tipo: 'popular' | 'rechazado' | 'agresor' | 'victima' | 'neutral';
  estadisticas: {
    elecciones?: number;
    rechazos?: number;
    fuerte?: number;
    maltrato?: number;
    victima?: number;
    cobarde?: number;
  };
  descripcion?: string;
  className?: string;
}

const StudentCard: React.FC<StudentCardProps> = ({
  nombre,
  apellido,
  grupo,
  tipo,
  estadisticas,
  descripcion,
  className = ''
}) => {
  const getCardStyle = () => {
    switch (tipo) {
      case 'popular':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          icon: Users,
          iconColor: 'text-green-600',
          badge: 'bg-green-100 text-green-800'
        };
      case 'rechazado':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          icon: TrendingDown,
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      case 'agresor':
        return {
          border: 'border-orange-200',
          bg: 'bg-orange-50',
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800'
        };
      case 'victima':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          icon: Shield,
          iconColor: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          icon: User,
          iconColor: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const style = getCardStyle();
  const Icon = style.icon;

  const getTipoLabel = () => {
    switch (tipo) {
      case 'popular': return 'Popular';
      case 'rechazado': return 'Rechazado';
      case 'agresor': return 'Agresor';
      case 'victima': return 'Víctima';
      default: return 'Neutral';
    }
  };

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 transition-all hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${style.badge} mr-3`}>
            <Icon className={`h-4 w-4 ${style.iconColor}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{nombre} {apellido}</h4>
            <p className="text-sm text-gray-600">Grupo {grupo}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.badge}`}>
          {getTipoLabel()}
        </span>
      </div>

      {/* Estadísticas */}
      <div className="space-y-2 mb-3">
        {estadisticas.elecciones !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Elecciones:</span>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-sm font-medium">{estadisticas.elecciones}%</span>
            </div>
          </div>
        )}
        
        {estadisticas.rechazos !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rechazos:</span>
            <div className="flex items-center">
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-sm font-medium">{estadisticas.rechazos}%</span>
            </div>
          </div>
        )}

        {estadisticas.fuerte !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Percibido como fuerte:</span>
            <span className="text-sm font-medium">{estadisticas.fuerte}%</span>
          </div>
        )}

        {estadisticas.maltrato !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Comportamiento agresivo:</span>
            <span className="text-sm font-medium">{estadisticas.maltrato}%</span>
          </div>
        )}

        {estadisticas.victima !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Identificado como víctima:</span>
            <span className="text-sm font-medium">{estadisticas.victima}%</span>
          </div>
        )}

        {estadisticas.cobarde !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Percibido como vulnerable:</span>
            <span className="text-sm font-medium">{estadisticas.cobarde}%</span>
          </div>
        )}
      </div>

      {/* Descripción */}
      {descripcion && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">{descripcion}</p>
        </div>
      )}
    </div>
  );
};

export default StudentCard;