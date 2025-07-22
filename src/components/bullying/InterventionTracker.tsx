import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, X, Edit, Trash2, Save, Calendar, User, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Intervention {
  id: string;
  title: string;
  description: string;
  targetStudents: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

interface InterventionTrackerProps {
  groupId: string;
}

/**
 * Componente para el seguimiento de intervenciones
 */
const InterventionTracker: React.FC<InterventionTrackerProps> = ({ groupId }) => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState<Omit<Intervention, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    targetStudents: [],
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    notes: ''
  });

  // Cargar intervenciones y estudiantes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar estudiantes del grupo
        const { data: studentsData, error: studentsError } = await supabase
          .from('estudiantes')
          .select(`
            id,
            nombre_estudiante,
            apellido_estudiante
          `)
          .eq('grupo_id', groupId);
        
        if (studentsError) throw studentsError;
        
        const formattedStudents = studentsData.map(student => ({
          id: student.id,
          name: `${student.nombre_estudiante} ${student.apellido_estudiante}`
        }));
        
        setStudents(formattedStudents);
        
        // En un sistema real, aquí cargaríamos las intervenciones desde la base de datos
        // Para este ejemplo, usamos datos simulados
        
        // Generar intervenciones de ejemplo
        const mockInterventions: Intervention[] = [
          {
            id: '1',
            title: 'Taller de habilidades sociales',
            description: 'Taller grupal para desarrollar habilidades sociales y empatía',
            targetStudents: formattedStudents.slice(0, 3).map(s => s.id),
            status: 'in_progress',
            dueDate: '2023-12-15',
            assignedTo: 'Psicólogo escolar',
            createdAt: '2023-11-20',
            notes: 'Primera sesión completada con buena participación'
          },
          {
            id: '2',
            title: 'Mediación entre pares',
            description: 'Sesión de mediación para resolver conflicto entre estudiantes',
            targetStudents: formattedStudents.slice(1, 3).map(s => s.id),
            status: 'completed',
            dueDate: '2023-11-30',
            assignedTo: 'Orientador',
            createdAt: '2023-11-15',
            notes: 'Se llegó a un acuerdo satisfactorio entre las partes'
          },
          {
            id: '3',
            title: 'Seguimiento individual',
            description: 'Sesiones individuales de seguimiento para estudiante en situación de vulnerabilidad',
            targetStudents: [formattedStudents[0]?.id].filter(Boolean),
            status: 'pending',
            dueDate: '2023-12-20',
            assignedTo: 'Psicólogo escolar',
            createdAt: '2023-11-25'
          }
        ];
        
        setInterventions(mockInterventions);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      }
    };
    
    if (groupId) {
      loadData();
    }
  }, [groupId]);

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en la selección de estudiantes
  const handleStudentSelection = (studentId: string) => {
    setFormData(prev => {
      const targetStudents = [...prev.targetStudents];
      
      if (targetStudents.includes(studentId)) {
        return {
          ...prev,
          targetStudents: targetStudents.filter(id => id !== studentId)
        };
      } else {
        return {
          ...prev,
          targetStudents: [...targetStudents, studentId]
        };
      }
    });
  };

  // Guardar intervención
  const handleSaveIntervention = () => {
    if (!formData.title || !formData.description || formData.targetStudents.length === 0) {
      alert('Por favor complete los campos requeridos');
      return;
    }
    
    if (editingId) {
      // Actualizar intervención existente
      setInterventions(prev => 
        prev.map(intervention => 
          intervention.id === editingId 
            ? { 
                ...intervention, 
                ...formData,
                // Mantener la fecha de creación original
                createdAt: intervention.createdAt
              } 
            : intervention
        )
      );
    } else {
      // Crear nueva intervención
      const newIntervention: Intervention = {
        id: Date.now().toString(), // En un sistema real, esto sería un UUID generado por la base de datos
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setInterventions(prev => [...prev, newIntervention]);
    }
    
    // Resetear formulario
    setFormData({
      title: '',
      description: '',
      targetStudents: [],
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      notes: ''
    });
    
    setShowForm(false);
    setEditingId(null);
  };

  // Editar intervención
  const handleEditIntervention = (intervention: Intervention) => {
    setFormData({
      title: intervention.title,
      description: intervention.description,
      targetStudents: intervention.targetStudents,
      status: intervention.status,
      dueDate: intervention.dueDate,
      assignedTo: intervention.assignedTo,
      notes: intervention.notes || ''
    });
    
    setEditingId(intervention.id);
    setShowForm(true);
  };

  // Eliminar intervención
  const handleDeleteIntervention = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta intervención?')) {
      setInterventions(prev => prev.filter(intervention => intervention.id !== id));
    }
  };

  // Cambiar estado de intervención
  const handleStatusChange = (id: string, status: Intervention['status']) => {
    setInterventions(prev => 
      prev.map(intervention => 
        intervention.id === id 
          ? { ...intervention, status } 
          : intervention
      )
    );
  };

  // Obtener nombre de estudiante por ID
  const getStudentName = (id: string) => {
    return students.find(student => student.id === id)?.name || 'Estudiante desconocido';
  };

  // Obtener color según estado
  const getStatusColor = (status: Intervention['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto según estado
  const getStatusText = (status: Intervention['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  // Obtener icono según estado
  const getStatusIcon = (status: Intervention['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Seguimiento de Intervenciones</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (!showForm) {
              setFormData({
                title: '',
                description: '',
                targetStudents: [],
                status: 'pending',
                dueDate: new Date().toISOString().split('T')[0],
                assignedTo: '',
                notes: ''
              });
            }
          }}
          className="px-3 py-1 bg-blue-dark text-white rounded-md hover:bg-blue-900 flex items-center text-sm"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Nueva Intervención
            </>
          )}
        </button>
      </div>

      {/* Formulario de intervención */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-4">
            {editingId ? 'Editar Intervención' : 'Nueva Intervención'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleFormChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estudiantes objetivo <span className="text-red-500">*</span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                {students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {students.map(student => (
                      <div key={student.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={formData.targetStudents.includes(student.id)}
                          onChange={() => handleStudentSelection(student.id)}
                          className="h-4 w-4 text-blue-dark focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay estudiantes disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveIntervention}
              className="px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-900 flex items-center"
            >
              <Save className="h-4 w-4 mr-1" />
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Lista de intervenciones */}
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Cargando intervenciones...</p>
        </div>
      ) : interventions.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intervención
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha límite
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interventions.map(intervention => (
                  <tr key={intervention.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{intervention.title}</div>
                      <div className="text-xs text-gray-500">{intervention.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {intervention.targetStudents.length > 0 ? (
                          <div className="flex flex-col space-y-1">
                            {intervention.targetStudents.map(studentId => (
                              <div key={studentId} className="flex items-center">
                                <User className="h-3 w-3 mr-1 text-gray-400" />
                                <span>{getStudentName(studentId)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">Ninguno</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(intervention.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(intervention.status)}
                          <span className="ml-1">{getStatusText(intervention.status)}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {intervention.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{intervention.assignedTo || 'No asignado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditIntervention(intervention)}
                          className="text-blue-dark hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIntervention(intervention.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No hay intervenciones registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-900 inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Crear primera intervención
          </button>
        </div>
      )}
    </div>
  );
};

export default InterventionTracker;
