import React, { useState } from 'react';
import { AlertCircle, BookOpen, Users, User, School, Download } from 'lucide-react';

interface InterventionRecommendationsProps {
  groupId: string;
  data?: {
    groupLevel: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
    individualLevel: {
      victims: string[];
      bullies: string[];
      bullyVictims: string[];
      observers: string[];
    };
    schoolLevel: string[];
    familyLevel: string[];
    resources: Array<{
      title: string;
      type: 'document' | 'video' | 'website' | 'activity';
      description: string;
      url?: string;
    }>;
  };
}

// Datos de ejemplo
const defaultData = {
  groupLevel: {
    immediate: [
      "Implementar sesiones de sensibilización sobre el bullying y sus consecuencias",
      "Establecer normas claras de convivencia con la participación de los estudiantes",
      "Realizar actividades de cohesión grupal para fortalecer relaciones positivas",
      "Implementar un sistema de reporte confidencial de situaciones de bullying"
    ],
    shortTerm: [
      "Desarrollar un programa de mediación entre pares",
      "Implementar actividades regulares de trabajo cooperativo",
      "Realizar talleres de habilidades sociales y resolución de conflictos",
      "Establecer un sistema de reconocimiento para comportamientos positivos"
    ],
    longTerm: [
      "Integrar la prevención del bullying en el currículo escolar",
      "Evaluar periódicamente el clima escolar y ajustar intervenciones",
      "Desarrollar un programa de mentoría entre estudiantes de diferentes grados",
      "Crear espacios seguros para la expresión emocional y el diálogo"
    ]
  },
  individualLevel: {
    victims: [
      "Proporcionar apoyo psicológico individual",
      "Desarrollar habilidades de asertividad y autodefensa",
      "Fortalecer la autoestima y el autoconcepto",
      "Crear una red de apoyo dentro del grupo",
      "Considerar la derivación a especialistas externos si es necesario"
    ],
    bullies: [
      "Intervención individual con enfoque en empatía y control de impulsos",
      "Establecer consecuencias claras para comportamientos agresivos",
      "Identificar y abordar posibles causas subyacentes del comportamiento",
      "Enseñar habilidades de resolución de conflictos",
      "Involucrar a la familia en el proceso de intervención"
    ],
    bullyVictims: [
      "Proporcionar apoyo psicológico especializado",
      "Desarrollar habilidades de regulación emocional",
      "Fortalecer habilidades sociales y de comunicación",
      "Implementar estrategias para romper el ciclo de victimización-agresión",
      "Seguimiento cercano de su evolución"
    ],
    observers: [
      "Sensibilizar sobre la importancia de no ser observadores pasivos",
      "Enseñar estrategias seguras para intervenir en situaciones de bullying",
      "Fomentar la empatía hacia las víctimas",
      "Reconocer y reforzar intervenciones positivas"
    ]
  },
  schoolLevel: [
    "Revisar y fortalecer la política anti-bullying del centro educativo",
    "Capacitar al personal docente en detección e intervención en casos de bullying",
    "Implementar un sistema de vigilancia en áreas comunes y recreos",
    "Crear un comité de convivencia escolar con participación de estudiantes",
    "Desarrollar protocolos claros de actuación ante casos de bullying"
  ],
  familyLevel: [
    "Realizar reuniones informativas con familias sobre el bullying y su prevención",
    "Proporcionar pautas para identificar señales de alerta en sus hijos",
    "Involucrar a las familias en actividades de prevención",
    "Establecer canales de comunicación efectivos entre escuela y familia",
    "Ofrecer recursos y apoyo a familias de estudiantes involucrados"
  ],
  resources: [
    {
      title: "Guía para la prevención del bullying en el aula",
      type: "document",
      description: "Manual con estrategias prácticas para docentes",
      url: "#"
    },
    {
      title: "Actividades de cohesión grupal",
      type: "document",
      description: "Compilación de dinámicas para fortalecer relaciones positivas",
      url: "#"
    },
    {
      title: "Protocolo de actuación ante casos de bullying",
      type: "document",
      description: "Procedimientos paso a paso para intervenir adecuadamente",
      url: "#"
    },
    {
      title: "Habilidades sociales y resolución de conflictos",
      type: "video",
      description: "Serie de videos educativos para trabajar con estudiantes",
      url: "#"
    },
    {
      title: "Plataforma de recursos anti-bullying",
      type: "website",
      description: "Sitio web con materiales, investigaciones y herramientas",
      url: "#"
    }
  ]
};

const InterventionRecommendations: React.FC<InterventionRecommendationsProps> = ({ groupId, data = defaultData }) => {
  const [activeTab, setActiveTab] = useState('group');

  return (
    <div className="space-y-6">
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('group')}
            className={`${
              activeTab === 'group'
                ? 'border-blue-dark text-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <Users className="inline-block h-5 w-5 mr-2" />
            Nivel Grupal
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`${
              activeTab === 'individual'
                ? 'border-blue-dark text-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <User className="inline-block h-5 w-5 mr-2" />
            Nivel Individual
          </button>
          <button
            onClick={() => setActiveTab('school')}
            className={`${
              activeTab === 'school'
                ? 'border-blue-dark text-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <School className="inline-block h-5 w-5 mr-2" />
            Nivel Institucional
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`${
              activeTab === 'resources'
                ? 'border-blue-dark text-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <BookOpen className="inline-block h-5 w-5 mr-2" />
            Recursos
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {/* Nivel Grupal */}
        {activeTab === 'group' && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">Recomendaciones a Nivel Grupal</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-blue-dark mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-dark mr-2">1</span>
                  Intervenciones Inmediatas
                </h4>
                <ul className="list-disc pl-8 space-y-2">
                  {data.groupLevel.immediate.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-blue-dark mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-dark mr-2">2</span>
                  Intervenciones a Corto Plazo
                </h4>
                <ul className="list-disc pl-8 space-y-2">
                  {data.groupLevel.shortTerm.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-blue-dark mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-dark mr-2">3</span>
                  Intervenciones a Largo Plazo
                </h4>
                <ul className="list-disc pl-8 space-y-2">
                  {data.groupLevel.longTerm.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Nivel Individual */}
        {activeTab === 'individual' && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">Recomendaciones a Nivel Individual</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <h4 className="text-md font-medium text-red-800 mb-3">Para Estudiantes Víctimas</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.individualLevel.victims.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                <h4 className="text-md font-medium text-orange-800 mb-3">Para Estudiantes Agresores</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.individualLevel.bullies.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                <h4 className="text-md font-medium text-purple-800 mb-3">Para Estudiantes Víctimas-Agresores</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.individualLevel.bullyVictims.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <h4 className="text-md font-medium text-blue-800 mb-3">Para Estudiantes Observadores</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.individualLevel.observers.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Las intervenciones individuales deben adaptarse a las características específicas de cada estudiante.
                    Se recomienda la participación de profesionales especializados para casos de mayor complejidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nivel Institucional */}
        {activeTab === 'school' && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">Recomendaciones a Nivel Institucional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">Para el Centro Educativo</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.schoolLevel.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-3">Para las Familias</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.familyLevel.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-md font-medium text-blue-800 mb-3">Enfoque Integral</h4>
              <p className="text-gray-700">
                La prevención e intervención efectiva del bullying requiere un enfoque integral que involucre a toda la comunidad educativa.
                Es fundamental la coordinación entre docentes, directivos, profesionales de apoyo, estudiantes y familias para crear un entorno
                seguro y positivo para todos los estudiantes.
              </p>
            </div>
          </div>
        )}

        {/* Recursos */}
        {activeTab === 'resources' && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-6">Recursos para la Intervención</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.resources.map((resource, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex">
                  <div className="flex-shrink-0 mr-4">
                    {resource.type === 'document' && (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    {resource.type === 'video' && (
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {resource.type === 'website' && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                    )}
                    {resource.type === 'activity' && (
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{resource.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar recurso
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Estos recursos son recomendaciones generales. Se sugiere adaptarlos a las características específicas
                    del grupo y el contexto educativo. Para acceder a la versión completa de los recursos, contacte con
                    el departamento de orientación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-dark hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar informe completo
        </button>
      </div>
    </div>
  );
};

export default InterventionRecommendations;
