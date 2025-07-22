import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, Video, FileText, ExternalLink, ChevronRight } from 'lucide-react';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'faq' | 'external';
  content?: string;
  url?: string;
  category: 'dashboard' | 'analysis' | 'reports' | 'general';
}

interface HelpPanelProps {
  currentSection?: string;
  className?: string;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ currentSection = 'general', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<HelpItem['category']>('general');

  const helpItems: HelpItem[] = [
    {
      id: 'dashboard-overview',
      title: '¿Cómo interpretar el dashboard?',
      description: 'Guía completa para entender las métricas y visualizaciones del dashboard BULL-S',
      type: 'guide',
      category: 'dashboard',
      content: `
        El dashboard BULL-S está organizado en varias secciones principales:
        
        **Información General:**
        - KPIs principales: Total de estudiantes, respuestas válidas, rango de edad
        - Descripción del estudio y metodología aplicada
        
        **Análisis Sociométrico:**
        - Elecciones y rechazos entre estudiantes
        - Identificación de estudiantes populares y rechazados
        - Nivel de cohesión grupal
        
        **Roles de Bullying:**
        - Identificación de agresores y víctimas
        - Perfiles de comportamiento por estudiante
        - Análisis multidimensional de roles
        
        **Variables Situacionales:**
        - Formas más comunes de agresión
        - Lugares donde ocurren los incidentes
        - Frecuencia de las agresiones
      `
    },
    {
      id: 'sociometric-analysis',
      title: '¿Qué es el análisis sociométrico?',
      description: 'Explicación del análisis de relaciones sociales entre estudiantes',
      type: 'guide',
      category: 'analysis',
      content: `
        El análisis sociométrico evalúa las relaciones sociales dentro del grupo:
        
        **Elecciones Positivas:**
        - Estudiantes preferidos como compañeros
        - Indica popularidad y aceptación social
        - Ayuda a identificar líderes positivos
        
        **Rechazos:**
        - Estudiantes evitados por sus compañeros
        - Puede indicar problemas de integración
        - Señala posibles víctimas de exclusión
        
        **Cohesión Grupal:**
        - Mide qué tan unido está el grupo
        - Identifica subgrupos y estudiantes aislados
        - Indica la salud social del aula
      `
    },
    {
      id: 'bullying-roles',
      title: 'Roles en la dinámica de bullying',
      description: 'Comprende los diferentes roles que pueden asumir los estudiantes',
      type: 'guide',
      category: 'analysis',
      content: `
        En las situaciones de bullying se identifican varios roles:
        
        **Agresores:**
        - Estudiantes que inician o lideran las agresiones
        - Pueden ser percibidos como "fuertes" por sus pares
        - Requieren intervención especializada
        
        **Víctimas:**
        - Estudiantes que sufren agresiones repetidas
        - Pueden ser percibidos como "cobardes" o vulnerables
        - Necesitan apoyo y protección
        
        **Observadores:**
        - Estudiantes que presencian pero no participan
        - Su actitud puede perpetuar o detener el bullying
        - Clave para la prevención
      `
    },
    {
      id: 'export-reports',
      title: '¿Cómo exportar informes?',
      description: 'Guía para generar y exportar informes del análisis',
      type: 'guide',
      category: 'reports',
      content: `
        Para exportar informes del análisis BULL-S:
        
        **Formatos Disponibles:**
        - PDF: Informe completo con gráficos y análisis
        - Excel: Datos tabulados para análisis adicional
        - Imagen: Capturas del dashboard para presentaciones
        
        **Pasos para Exportar:**
        1. Selecciona los filtros deseados (grupo, fecha, etc.)
        2. Haz clic en el botón "Exportar"
        3. Elige el formato de exportación
        4. El archivo se descargará automáticamente
        
        **Recomendaciones:**
        - Usa PDF para informes ejecutivos
        - Usa Excel para análisis estadísticos
        - Usa imágenes para presentaciones
      `
    },
    {
      id: 'intervention-recommendations',
      title: 'Implementar recomendaciones',
      description: 'Cómo actuar sobre las recomendaciones del sistema',
      type: 'guide',
      category: 'general',
      content: `
        Las recomendaciones se clasifican por prioridad y tipo:
        
        **Prioridad Alta (Inmediata):**
        - Requieren acción en 24-48 horas
        - Involucran situaciones de riesgo
        - Deben ser atendidas por profesionales
        
        **Prioridad Media (Corto Plazo):**
        - Implementar en 1-2 semanas
        - Medidas preventivas y de apoyo
        - Involucran cambios en el ambiente
        
        **Prioridad Baja (Largo Plazo):**
        - Estrategias de seguimiento
        - Programas de prevención general
        - Capacitación y formación
      `
    },
    {
      id: 'video-tutorial',
      title: 'Tutorial en Video: Navegación Básica',
      description: 'Video tutorial sobre cómo navegar por el dashboard',
      type: 'video',
      category: 'dashboard',
      url: '#video-tutorial'
    },
    {
      id: 'external-resources',
      title: 'Recursos Externos sobre BULL-S',
      description: 'Enlaces a documentación oficial y recursos adicionales',
      type: 'external',
      category: 'general',
      url: 'https://example.com/bulls-resources'
    }
  ];

  const categories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'analysis', label: 'Análisis', icon: FileText },
    { id: 'reports', label: 'Informes', icon: FileText }
  ];

  const filteredItems = helpItems.filter(item => item.category === activeCategory);

  const getItemIcon = (type: HelpItem['type']) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4" />;
      case 'external':
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const handleItemClick = (item: HelpItem) => {
    if (item.type === 'external' && item.url) {
      window.open(item.url, '_blank');
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        title="Ayuda"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {/* Help Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Centro de Ayuda</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {!selectedItem ? (
              <>
                {/* Categories */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex space-x-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id as HelpItem['category'])}
                          className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                            activeCategory === category.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Help Items */}
                <div className="max-h-80 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-blue-500 mt-0.5">
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Selected Item Content */
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                  >
                    ← Volver
                  </button>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedItem.title}
                  </h4>
                </div>
                
                <div className="p-4">
                  {selectedItem.content && (
                    <div className="prose prose-sm max-w-none">
                      {selectedItem.content.split('\n').map((line, index) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h5 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                              {line.slice(2, -2)}
                            </h5>
                          );
                        } else if (line.startsWith('- ')) {
                          return (
                            <li key={index} className="text-gray-700 ml-4">
                              {line.slice(2)}
                            </li>
                          );
                        } else if (line.trim()) {
                          return (
                            <p key={index} className="text-gray-700 mb-2">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HelpPanel;