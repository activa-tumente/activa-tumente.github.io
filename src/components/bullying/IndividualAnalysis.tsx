import React, { useState } from 'react';
import { Search, AlertCircle, Shield, Target, Users } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  role: 'victim' | 'bully' | 'bully-victim' | 'observer';
  riskLevel: 'high' | 'medium' | 'low';
  socialStatus: 'popular' | 'average' | 'rejected' | 'isolated';
  positiveConnections: number;
  negativeConnections: number;
  observations: string;
  recommendedActions: string[];
}

interface IndividualAnalysisProps {
  groupId: string;
  data?: {
    students: StudentData[];
  };
}

// Datos de ejemplo
const defaultData = {
  students: [
    {
      id: '1',
      name: 'Ana García',
      role: 'observer',
      riskLevel: 'low',
      socialStatus: 'popular',
      positiveConnections: 5,
      negativeConnections: 1,
      observations: 'Ana es una estudiante bien integrada en el grupo, con buenas habilidades sociales. Suele mantenerse al margen de los conflictos, aunque no interviene activamente para detenerlos.',
      recommendedActions: [
        'Fomentar su liderazgo positivo',
        'Involucrarla en actividades de mediación entre pares',
        'Reforzar su capacidad para intervenir cuando observe situaciones de bullying'
      ]
    },
    {
      id: '2',
      name: 'Carlos López',
      role: 'bully',
      riskLevel: 'high',
      socialStatus: 'average',
      positiveConnections: 3,
      negativeConnections: 4,
      observations: 'Carlos muestra comportamientos agresivos hacia algunos compañeros, especialmente hacia María y Pedro. Suele utilizar insultos y exclusión social como formas principales de agresión.',
      recommendedActions: [
        'Intervención individual con enfoque en empatía y control de impulsos',
        'Establecer consecuencias claras para comportamientos agresivos',
        'Reunión con padres para establecer plan de acción conjunto',
        'Seguimiento semanal de su comportamiento'
      ]
    },
    {
      id: '3',
      name: 'María Rodríguez',
      role: 'victim',
      riskLevel: 'high',
      socialStatus: 'rejected',
      positiveConnections: 1,
      negativeConnections: 6,
      observations: 'María es frecuentemente víctima de agresiones verbales y exclusión social. Muestra signos de aislamiento y su rendimiento académico ha disminuido en los últimos meses.',
      recommendedActions: [
        'Apoyo psicológico individual',
        'Fortalecer su red de apoyo dentro del grupo',
        'Desarrollar habilidades de asertividad y autoestima',
        'Reunión con padres para informar y coordinar apoyo',
        'Considerar derivación a especialista externo'
      ]
    },
    {
      id: '4',
      name: 'Juan Pérez',
      role: 'observer',
      riskLevel: 'low',
      socialStatus: 'average',
      positiveConnections: 4,
      negativeConnections: 2,
      observations: 'Juan mantiene buenas relaciones con la mayoría del grupo. No participa en situaciones de bullying, pero tampoco interviene para detenerlas.',
      recommendedActions: [
        'Fomentar su participación en actividades de prevención del bullying',
        'Desarrollar habilidades para intervenir de manera segura cuando observe situaciones de acoso'
      ]
    },
    {
      id: '5',
      name: 'Laura Martínez',
      role: 'observer',
      riskLevel: 'low',
      socialStatus: 'popular',
      positiveConnections: 6,
      negativeConnections: 0,
      observations: 'Laura es una estudiante con alto estatus social en el grupo. Tiene buenas relaciones con casi todos sus compañeros y podría ser una influencia positiva.',
      recommendedActions: [
        'Potenciar su rol como líder positivo',
        'Involucrarla en iniciativas de prevención del bullying',
        'Fomentar que utilice su influencia para promover la inclusión'
      ]
    },
    {
      id: '6',
      name: 'Pedro Sánchez',
      role: 'bully-victim',
      riskLevel: 'high',
      socialStatus: 'rejected',
      positiveConnections: 2,
      negativeConnections: 5,
      observations: 'Pedro recibe agresiones de algunos compañeros, pero también agrede a otros estudiantes más vulnerables. Muestra dificultades para regular sus emociones y comportamientos impulsivos.',
      recommendedActions: [
        'Intervención especializada para abordar su doble rol',
        'Apoyo psicológico para manejar emociones y desarrollar habilidades sociales',
        'Establecer límites claros sobre comportamientos inaceptables',
        'Reunión con familia para coordinar estrategias',
        'Seguimiento cercano de su evolución'
      ]
    },
    {
      id: '7',
      name: 'Sofía Fernández',
      role: 'observer',
      riskLevel: 'low',
      socialStatus: 'average',
      positiveConnections: 5,
      negativeConnections: 1,
      observations: 'Sofía mantiene buenas relaciones con sus compañeros. Ocasionalmente ha intentado defender a estudiantes que sufren bullying.',
      recommendedActions: [
        'Reforzar positivamente sus intervenciones en defensa de otros',
        'Desarrollar más estrategias para intervenir de manera efectiva',
        'Involucrarla en programas de mediación entre pares'
      ]
    },
    {
      id: '8',
      name: 'Diego González',
      role: 'observer',
      riskLevel: 'low',
      socialStatus: 'average',
      positiveConnections: 4,
      negativeConnections: 2,
      observations: 'Diego tiene un perfil social neutro en el grupo. No participa en situaciones de bullying pero tampoco interviene.',
      recommendedActions: [
        'Sensibilizar sobre la importancia de no ser observador pasivo',
        'Desarrollar habilidades para intervenir de manera segura'
      ]
    },
    {
      id: '9',
      name: 'Valentina Torres',
      role: 'victim',
      riskLevel: 'medium',
      socialStatus: 'isolated',
      positiveConnections: 1,
      negativeConnections: 5,
      observations: 'Valentina sufre principalmente exclusión social. Tiene dificultades para integrarse en actividades grupales y suele estar aislada durante los recreos.',
      recommendedActions: [
        'Implementar estrategias de inclusión en actividades grupales',
        'Apoyo para desarrollar habilidades sociales',
        'Asignar compañeros de apoyo para actividades específicas',
        'Seguimiento de su bienestar emocional'
      ]
    },
    {
      id: '10',
      name: 'Mateo Díaz',
      role: 'bully',
      riskLevel: 'medium',
      socialStatus: 'average',
      positiveConnections: 3,
      negativeConnections: 4,
      observations: 'Mateo participa en situaciones de bullying, especialmente junto a Carlos. Su comportamiento parece estar influenciado por la dinámica de grupo y la búsqueda de estatus.',
      recommendedActions: [
        'Intervención individual enfocada en empatía',
        'Separarlo de influencias negativas en actividades grupales',
        'Establecer consecuencias claras para comportamientos agresivos',
        'Reunión con padres para informar y establecer estrategias conjuntas'
      ]
    }
  ]
};

const IndividualAnalysis: React.FC<IndividualAnalysisProps> = ({ groupId, data = defaultData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  // Filtrar estudiantes según búsqueda y filtros
  const filteredStudents = data.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? student.role === selectedRole : true;
    const matchesRisk = selectedRisk ? student.riskLevel === selectedRisk : true;
    return matchesSearch && matchesRole && matchesRisk;
  });

  // Función para obtener color según rol
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'victim': return 'bg-red-100 text-red-800';
      case 'bully': return 'bg-orange-100 text-orange-800';
      case 'bully-victim': return 'bg-purple-100 text-purple-800';
      case 'observer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color según nivel de riesgo
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener texto según rol
  const getRoleText = (role: string) => {
    switch(role) {
      case 'victim': return 'Víctima';
      case 'bully': return 'Agresor';
      case 'bully-victim': return 'Víctima-Agresor';
      case 'observer': return 'Observador';
      default: return role;
    }
  };

  // Función para obtener texto según nivel de riesgo
  const getRiskText = (risk: string) => {
    switch(risk) {
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return risk;
    }
  };

  // Función para obtener texto según estatus social
  const getSocialStatusText = (status: string) => {
    switch(status) {
      case 'popular': return 'Popular';
      case 'average': return 'Promedio';
      case 'rejected': return 'Rechazado';
      case 'isolated': return 'Aislado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Análisis Individual de Estudiantes</h3>
        
        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedRole || ''}
              onChange={(e) => setSelectedRole(e.target.value || null)}
            >
              <option value="">Todos los roles</option>
              <option value="victim">Víctimas</option>
              <option value="bully">Agresores</option>
              <option value="bully-victim">Víctimas-Agresores</option>
              <option value="observer">Observadores</option>
            </select>
          </div>
          
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedRisk || ''}
              onChange={(e) => setSelectedRisk(e.target.value || null)}
            >
              <option value="">Todos los niveles de riesgo</option>
              <option value="high">Riesgo Alto</option>
              <option value="medium">Riesgo Medio</option>
              <option value="low">Riesgo Bajo</option>
            </select>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {filteredStudents.length} estudiantes encontrados
            </span>
          </div>
        </div>
        
        {/* Lista de estudiantes */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Riesgo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estatus Social
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conexiones
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(student.role)}`}>
                      {getRoleText(student.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(student.riskLevel)}`}>
                      {getRiskText(student.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSocialStatusText(student.socialStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="text-green-600">+{student.positiveConnections}</span> / 
                      <span className="text-red-600">-{student.negativeConnections}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No se encontraron estudiantes con los criterios seleccionados.</p>
          </div>
        )}
      </div>

      {/* Detalles del estudiante seleccionado */}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">Detalles de {selectedStudent.name}</h3>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Rol</div>
              <div className={`mt-1 text-lg font-semibold ${
                selectedStudent.role === 'victim' ? 'text-red-600' : 
                selectedStudent.role === 'bully' ? 'text-orange-600' : 
                selectedStudent.role === 'bully-victim' ? 'text-purple-600' : 
                'text-blue-600'
              }`}>
                {getRoleText(selectedStudent.role)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Nivel de Riesgo</div>
              <div className={`mt-1 text-lg font-semibold ${
                selectedStudent.riskLevel === 'high' ? 'text-red-600' : 
                selectedStudent.riskLevel === 'medium' ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {getRiskText(selectedStudent.riskLevel)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Estatus Social</div>
              <div className="mt-1 text-lg font-semibold text-gray-800">
                {getSocialStatusText(selectedStudent.socialStatus)}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-2">Observaciones</h4>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
              {selectedStudent.observations}
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Acciones Recomendadas</h4>
            <ul className="list-disc pl-5 space-y-1 bg-gray-50 p-4 rounded-lg">
              {selectedStudent.recommendedActions.map((action, index) => (
                <li key={index} className="text-gray-600">{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Este análisis individual se basa en los datos recopilados a través del cuestionario y las observaciones realizadas.
              Se recomienda complementar esta información con observaciones directas y entrevistas individuales para una evaluación más completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualAnalysis;
