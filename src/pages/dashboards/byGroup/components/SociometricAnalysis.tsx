import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus, Info } from 'lucide-react';

interface Student {
  id: string;
  nombre: string;
  apellido: string;
  genero?: string;
  edad?: number;
}

interface Response {
  id: string;
  estudiante_id: string;
  pregunta_id: string;
  respuesta: string;
  estudiante?: {
    id: string;
    nombre: string;
    apellido: string;
    genero?: string;
  };
  pregunta?: {
    id: string;
    texto: string;
    tipo: string;
    categoria: string;
  };
}

interface SociometricAnalysisProps {
  students: Student[];
  responses: Response[];
  filters: Record<string, string>;
}

/**
 * Componente que muestra el análisis sociométrico del grupo con un sociograma interactivo
 */
const SociometricAnalysis: React.FC<SociometricAnalysisProps> = ({ students, responses, filters }) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [sociometricData, setSociometricData] = useState<any>(null);
  const [sociometricStatus, setSociometricStatus] = useState<Record<string, any>>({});

  // Procesar datos sociométricos cuando cambian los estudiantes o respuestas
  useEffect(() => {
    if (students.length === 0 || responses.length === 0) return;

    // Procesar respuestas para crear el sociograma
    const processResponses = () => {
      // Crear matriz de relaciones
      const relationMatrix: Record<string, Record<string, number>> = {};
      
      // Inicializar matriz con todos los estudiantes
      students.forEach(student => {
        relationMatrix[student.id] = {};
        students.forEach(peer => {
          if (student.id !== peer.id) {
            relationMatrix[student.id][peer.id] = 0;
          }
        });
      });

      // Procesar respuestas de aceptación y rechazo
      responses.forEach(response => {
        // Filtrar solo preguntas de aceptación o rechazo
        if (response.pregunta?.categoria === 'aceptacion' || response.pregunta?.categoria === 'rechazo') {
          const fromStudentId = response.estudiante_id;
          const toStudentIds = response.respuesta.split(',').map(id => id.trim());
          
          // Valor según categoría: positivo para aceptación, negativo para rechazo
          const value = response.pregunta?.categoria === 'aceptacion' ? 1 : -1;
          
          // Actualizar matriz de relaciones
          toStudentIds.forEach(toStudentId => {
            if (relationMatrix[fromStudentId] && relationMatrix[fromStudentId][toStudentId] !== undefined) {
              relationMatrix[fromStudentId][toStudentId] += value;
            }
          });
        }
      });

      // Calcular estatus sociométrico
      const status: Record<string, any> = {};
      students.forEach(student => {
        // Contar aceptaciones y rechazos recibidos
        let acceptances = 0;
        let rejections = 0;
        
        students.forEach(peer => {
          if (student.id !== peer.id && relationMatrix[peer.id][student.id] !== undefined) {
            const value = relationMatrix[peer.id][student.id];
            if (value > 0) acceptances += value;
            if (value < 0) rejections += Math.abs(value);
          }
        });
        
        // Calcular índices
        const totalPeers = students.length - 1;
        const acceptanceIndex = totalPeers > 0 ? (acceptances / totalPeers) : 0;
        const rejectionIndex = totalPeers > 0 ? (rejections / totalPeers) : 0;
        
        // Determinar estatus
        let statusType = 'promedio';
        if (acceptanceIndex > 0.3 && rejectionIndex < 0.1) {
          statusType = 'popular';
        } else if (acceptanceIndex < 0.1 && rejectionIndex > 0.3) {
          statusType = 'rechazado';
        } else if (acceptanceIndex > 0.3 && rejectionIndex > 0.3) {
          statusType = 'controvertido';
        } else if (acceptanceIndex < 0.1 && rejectionIndex < 0.1) {
          statusType = 'aislado';
        }
        
        status[student.id] = {
          acceptances,
          rejections,
          acceptanceIndex,
          rejectionIndex,
          statusType
        };
      });

      setSociometricStatus(status);
      setSociometricData(relationMatrix);
    };

    processResponses();
  }, [students, responses]);

  // Obtener color según estatus sociométrico
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'popular': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'controvertido': return 'bg-amber-100 text-amber-800';
      case 'aislado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener etiqueta según estatus sociométrico
  const getStatusLabel = (statusType: string) => {
    switch (statusType) {
      case 'popular': return 'Popular';
      case 'rechazado': return 'Rechazado';
      case 'controvertido': return 'Controvertido';
      case 'aislado': return 'Aislado';
      default: return 'Promedio';
    }
  };

  // Renderizar sociograma (versión simplificada)
  const renderSociogram = () => {
    if (!sociometricData || students.length === 0) {
      return (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No hay datos suficientes para generar el sociograma.</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          Este es un sociograma simplificado. En la implementación completa, se mostraría un grafo interactivo
          con nodos representando estudiantes y aristas representando relaciones.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => {
            const status = sociometricStatus[student.id] || {};
            const statusType = status.statusType || 'promedio';
            const statusColor = getStatusColor(statusType);
            
            return (
              <div 
                key={student.id}
                className={`p-4 rounded-lg border ${selectedStudent === student.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} cursor-pointer hover:bg-gray-50`}
                onClick={() => setSelectedStudent(student.id === selectedStudent ? null : student.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.genero === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'} mr-2`}>
                      {student.nombre.charAt(0)}{student.apellido.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{student.nombre} {student.apellido}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                        {getStatusLabel(statusType)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm">Aceptaciones: {status.acceptances || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <UserMinus className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm">Rechazos: {status.rejections || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar detalles del estudiante seleccionado
  const renderStudentDetails = () => {
    if (!selectedStudent) return null;
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return null;
    
    const status = sociometricStatus[student.id] || {};
    
    // Encontrar relaciones
    const relationships: Record<string, any[]> = {
      acceptedBy: [],
      rejectedBy: [],
      accepts: [],
      rejects: []
    };
    
    if (sociometricData) {
      // Quiénes aceptan a este estudiante
      students.forEach(peer => {
        if (peer.id !== student.id && sociometricData[peer.id] && sociometricData[peer.id][student.id] > 0) {
          relationships.acceptedBy.push(peer);
        }
      });
      
      // Quiénes rechazan a este estudiante
      students.forEach(peer => {
        if (peer.id !== student.id && sociometricData[peer.id] && sociometricData[peer.id][student.id] < 0) {
          relationships.rejectedBy.push(peer);
        }
      });
      
      // A quiénes acepta este estudiante
      if (sociometricData[student.id]) {
        Object.entries(sociometricData[student.id]).forEach(([peerId, value]) => {
          if (Number(value) > 0) {
            const peer = students.find(s => s.id === peerId);
            if (peer) relationships.accepts.push(peer);
          }
        });
      }
      
      // A quiénes rechaza este estudiante
      if (sociometricData[student.id]) {
        Object.entries(sociometricData[student.id]).forEach(([peerId, value]) => {
          if (Number(value) < 0) {
            const peer = students.find(s => s.id === peerId);
            if (peer) relationships.rejects.push(peer);
          }
        });
      }
    }
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
        <h3 className="text-lg font-semibold mb-3">
          Detalles de {student.nombre} {student.apellido}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Estatus Sociométrico</h4>
            <div className={`inline-block px-3 py-1 rounded-full ${getStatusColor(status.statusType || 'promedio')} mb-3`}>
              {getStatusLabel(status.statusType || 'promedio')}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Índice de aceptación:</span>
                <span className="text-sm font-medium">{(status.acceptanceIndex * 100 || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Índice de rechazo:</span>
                <span className="text-sm font-medium">{(status.rejectionIndex * 100 || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Relaciones</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1">
                  <UserPlus className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium">Es aceptado por ({relationships.acceptedBy.length}):</span>
                </div>
                {relationships.acceptedBy.length > 0 ? (
                  <div className="text-sm text-gray-600 pl-5">
                    {relationships.acceptedBy.map(peer => (
                      <span key={peer.id} className="inline-block mr-2">{peer.nombre} {peer.apellido.charAt(0)}.,</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 pl-5">Ningún estudiante</div>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <UserMinus className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm font-medium">Es rechazado por ({relationships.rejectedBy.length}):</span>
                </div>
                {relationships.rejectedBy.length > 0 ? (
                  <div className="text-sm text-gray-600 pl-5">
                    {relationships.rejectedBy.map(peer => (
                      <span key={peer.id} className="inline-block mr-2">{peer.nombre} {peer.apellido.charAt(0)}.,</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 pl-5">Ningún estudiante</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <Info className="h-6 w-6 text-blue-600 mr-2" />
          <div>
            <h4 className="font-medium text-blue-800">Análisis Sociométrico</h4>
            <p className="text-sm text-blue-700">
              Este análisis muestra las relaciones sociales entre los estudiantes del grupo,
              identificando patrones de aceptación y rechazo. Seleccione un estudiante para ver más detalles.
            </p>
          </div>
        </div>
      </div>
      
      {/* Leyenda de estatus sociométrico */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium mr-2">Estatus:</span>
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Popular</span>
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Rechazado</span>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">Controvertido</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Aislado</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">Promedio</span>
      </div>
      
      {/* Sociograma */}
      {renderSociogram()}
      
      {/* Detalles del estudiante seleccionado */}
      {renderStudentDetails()}
    </div>
  );
};

export default SociometricAnalysis;