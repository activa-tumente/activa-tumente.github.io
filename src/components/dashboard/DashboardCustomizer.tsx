import React, { useState } from 'react';
import { Settings, X, Check, Eye, EyeOff } from 'lucide-react';

interface DashboardSection {
  id: string;
  label: string;
  visible: boolean;
}

interface DashboardCustomizerProps {
  sections: DashboardSection[];
  onSectionsChange: (sections: DashboardSection[]) => void;
}

/**
 * Componente para personalizar la visualización del dashboard
 */
const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ 
  sections, 
  onSectionsChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSections, setLocalSections] = useState<DashboardSection[]>(sections);

  const toggleSection = (sectionId: string) => {
    const updatedSections = localSections.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible } 
        : section
    );
    setLocalSections(updatedSections);
  };

  const applyChanges = () => {
    onSectionsChange(localSections);
    setIsOpen(false);
  };

  const cancelChanges = () => {
    setLocalSections(sections);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Personalizar dashboard"
      >
        <Settings className="h-4 w-4 mr-1" />
        Personalizar
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Personalizar Dashboard</h3>
            <button
              onClick={cancelChanges}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-3">
              Selecciona las secciones que deseas visualizar en el dashboard.
            </p>
            
            <div className="space-y-2">
              {localSections.map(section => (
                <div 
                  key={section.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-700">{section.label}</span>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`p-1 rounded-full ${
                      section.visible 
                        ? 'text-blue-600 hover:text-blue-800' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
                  >
                    {section.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 flex justify-end space-x-2 rounded-b-md">
            <button
              onClick={cancelChanges}
              className="px-3 py-1 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={applyChanges}
              className="px-3 py-1 text-xs text-white bg-blue-dark hover:bg-blue-900 rounded-md flex items-center"
            >
              <Check className="h-3 w-3 mr-1" />
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCustomizer;
