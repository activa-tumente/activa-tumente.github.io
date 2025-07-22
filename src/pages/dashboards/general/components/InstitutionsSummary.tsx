import React from 'react';
import { School, MapPin, Phone, Mail, Globe, Users } from 'lucide-react';

interface InstitutionsSummaryProps {
  institution: {
    id: string;
    nombre: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    sitio_web?: string;
    tipo_institucion?: string;
    total_estudiantes?: number;
  };
}

/**
 * Componente que muestra un resumen de la información de una institución educativa
 */
const InstitutionsSummary: React.FC<InstitutionsSummaryProps> = ({ institution }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <School className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">{institution.nombre}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {institution.direccion && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span className="text-gray-700">{institution.direccion}</span>
            </div>
          )}
          
          {institution.telefono && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span className="text-gray-700">{institution.telefono}</span>
            </div>
          )}
          
          {institution.email && (
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <a href={`mailto:${institution.email}`} className="text-blue-600 hover:underline">
                {institution.email}
              </a>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {institution.sitio_web && (
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <a 
                href={institution.sitio_web.startsWith('http') ? institution.sitio_web : `https://${institution.sitio_web}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {institution.sitio_web}
              </a>
            </div>
          )}
          
          {institution.tipo_institucion && (
            <div className="flex items-start">
              <School className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span className="text-gray-700">
                Tipo: {institution.tipo_institucion}
              </span>
            </div>
          )}
          
          {institution.total_estudiantes !== undefined && (
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span className="text-gray-700">
                Total estudiantes: {institution.total_estudiantes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionsSummary;