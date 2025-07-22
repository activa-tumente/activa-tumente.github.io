import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft,
  Building2,
  GraduationCap,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import sociometricService from '../../services/sociometricService';
import { supabase } from '../../lib/supabaseClient';

interface Estudiante {
  id: string;
  nombre: string;
  apellido?: string;
  edad?: number;
  genero?: string;
  numero_documento?: string;
  tipo_documento?: string;
  grupo_id: string;
  grupo_nombre?: string;
  institucion_nombre?: string;
  created_at?: string;
}

interface Grupo {
  id: string;
  nombre: string;
  institucion_id: string;
  institucion_nombre?: string;
}

const EstudiantesPage: React.FC = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    genero: '',
    numero_documento: '',
    tipo_documento: 'CC',
    grupo_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar grupos con información de institución
      let gruposData;
      let gruposError;
      
      try {
        // Intentar con la relación instituciones
        const result = await supabase
          .from('grupos')
          .select(`
            *,
            instituciones!inner(nombre)
          `)
          .order('nombre');
          
        gruposData = result.data;
        gruposError = result.error;
        
        if (gruposError) {
          // Si falla, intentar con instituciones_educativas
          const altResult = await supabase
            .from('grupos')
            .select(`
              *,
              instituciones_educativas!inner(nombre)
            `)
            .order('nombre');
            
          gruposData = altResult.data;
          gruposError = altResult.error;
          
          // Normalizar los datos para mantener la estructura esperada
          if (gruposData) {
            gruposData = gruposData.map(grupo => ({
              ...grupo,
              instituciones: grupo.instituciones_educativas
            }));
          }
        }
      } catch (e) {
        console.error('Error al cargar grupos:', e);
        // Si ambos fallan, usar datos de ejemplo
        gruposData = sociometricService.getGruposEjemplo();
        gruposError = null;
      }

      if (gruposError) throw gruposError;

      const gruposConInstitucion = (gruposData || []).map(grupo => ({
        ...grupo,
        institucion_nombre: grupo.instituciones?.nombre || 'Colegio La SALLE'
      }));
      setGrupos(gruposConInstitucion);
      
      // Cargar estudiantes con información de grupo e institución
      let estudiantesData;
      let estudiantesError;
      
      try {
        // Intentar con la relación instituciones
        const result = await supabase
          .from('estudiantes')
          .select(`
            *,
            grupos!inner(
              nombre,
              instituciones!inner(nombre)
            )
          `)
          .order('nombre');
          
        estudiantesData = result.data;
        estudiantesError = result.error;
        
        if (estudiantesError && estudiantesError.code === 'PGRST200') {
          // Si falla, intentar con instituciones_educativas
          const altResult = await supabase
            .from('estudiantes')
            .select(`
              *,
              grupos!inner(
                nombre,
                instituciones_educativas!inner(nombre)
              )
            `)
            .order('nombre');
            
          estudiantesData = altResult.data;
          estudiantesError = altResult.error;
          
          // Normalizar los datos para mantener la estructura esperada
          if (estudiantesData) {
            estudiantesData = estudiantesData.map(estudiante => ({
              ...estudiante,
              grupos: {
                ...estudiante.grupos,
                instituciones: estudiante.grupos?.instituciones_educativas
              }
            }));
          }
        }
      } catch (e) {
        console.error('Error al cargar estudiantes:', e);
        // Si falla, usar datos de ejemplo
        estudiantesData = sociometricService.getEstudiantesEjemplo();
        estudiantesError = null;
      }

      if (estudiantesError) {
        console.error('Error al cargar estudiantes:', estudiantesError);
        // Usar datos de ejemplo si hay error
        estudiantesData = sociometricService.getEstudiantesEjemplo();
      }

      const estudiantesConInfo = (estudiantesData || []).map(estudiante => {
        // Si es dato de ejemplo, agregar información del grupo
        if (!estudiante.grupos) {
          const grupo = gruposConInstitucion.find(g => g.id === estudiante.grupo_id);
          return {
            ...estudiante,
            grupo_nombre: grupo?.nombre || 'Grupo desconocido',
            institucion_nombre: grupo?.institucion_nombre || 'Colegio La SALLE'
          };
        }
        
        return {
          ...estudiante,
          grupo_nombre: estudiante.grupos?.nombre,
          institucion_nombre: estudiante.grupos?.instituciones?.nombre
        };
      });

      setEstudiantes(estudiantesConInfo);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // En caso de error total, usar datos de ejemplo
      const gruposEjemplo = sociometricService.getGruposEjemplo();
      const estudiantesEjemplo = sociometricService.getEstudiantesEjemplo();
      
      const gruposConInstitucion = gruposEjemplo.map(grupo => ({
        ...grupo,
        institucion_nombre: 'Colegio La SALLE'
      }));
      
      const estudiantesConInfo = estudiantesEjemplo.map(estudiante => {
        const grupo = gruposConInstitucion.find(g => g.id === estudiante.grupo_id);
        return {
          ...estudiante,
          grupo_nombre: grupo?.nombre || 'Grupo desconocido',
          institucion_nombre: 'Colegio La SALLE'
        };
      });
      
      setGrupos(gruposConInstitucion);
      setEstudiantes(estudiantesConInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSave = {
        ...formData,
        edad: formData.edad ? parseInt(formData.edad) : null
      };

      if (editingEstudiante) {
        // Actualizar estudiante existente
        const { error } = await supabase
          .from('estudiantes')
          .update(dataToSave)
          .eq('id', editingEstudiante.id);

        if (error) throw error;
      } else {
        // Crear nuevo estudiante
        const { error } = await supabase
          .from('estudiantes')
          .insert([dataToSave]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingEstudiante(null);
      setFormData({
        nombre: '',
        apellido: '',
        edad: '',
        genero: '',
        numero_documento: '',
        tipo_documento: 'CC',
        grupo_id: ''
      });
      loadData();
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      alert('Error al guardar el estudiante');
    }
  };

  const handleEdit = (estudiante: Estudiante) => {
    setEditingEstudiante(estudiante);
    setFormData({
      nombre: estudiante.nombre,
      apellido: estudiante.apellido || '',
      edad: estudiante.edad?.toString() || '',
      genero: estudiante.genero || '',
      numero_documento: estudiante.numero_documento || '',
      tipo_documento: estudiante.tipo_documento || 'CC',
      grupo_id: estudiante.grupo_id
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('estudiantes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      alert('Error al eliminar el estudiante');
    }
  };

  const filteredEstudiantes = estudiantes.filter(estudiante => {
    const matchesSearch = 
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.numero_documento?.includes(searchTerm) ||
      estudiante.grupo_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.institucion_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrupo = !selectedGrupo || estudiante.grupo_id === selectedGrupo;
    return matchesSearch && matchesGrupo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel de Administración
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="h-8 w-8 mr-3 text-purple-600" />
                Gestión de Estudiantes
              </h1>
              <p className="text-gray-600 mt-2">
                Administrar estudiantes por grupo e institución educativa
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingEstudiante(null);
                setFormData({
                  nombre: '',
                  apellido: '',
                  edad: '',
                  genero: '',
                  numero_documento: '',
                  tipo_documento: 'CC',
                  grupo_id: ''
                });
                setShowModal(true);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Estudiante
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, documento, grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedGrupo}
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos los grupos</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre} - {grupo.institucion_nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-xl font-semibold text-gray-900">{filteredEstudiantes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Masculino</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredEstudiantes.filter(e => e.genero === 'M').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-pink-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Femenino</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredEstudiantes.filter(e => e.genero === 'F').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Edad Promedio</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredEstudiantes.length > 0 
                    ? Math.round(filteredEstudiantes
                        .filter(e => e.edad)
                        .reduce((sum, e) => sum + (e.edad || 0), 0) / 
                        filteredEstudiantes.filter(e => e.edad).length) || 0
                    : 0
                  } años
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredEstudiantes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No se encontraron estudiantes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edad/Género
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEstudiantes.map((estudiante) => (
                    <tr key={estudiante.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {estudiante.nombre} {estudiante.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {estudiante.tipo_documento}: {estudiante.numero_documento || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {estudiante.edad ? `${estudiante.edad} años` : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {estudiante.genero === 'M' ? 'Masculino' : 
                           estudiante.genero === 'F' ? 'Femenino' : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                          {estudiante.grupo_nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {estudiante.institucion_nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(estudiante)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante.id)}
                            className="text-red-600 hover:text-red-900"
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
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupo *
                    </label>
                    <select
                      required
                      value={formData.grupo_id}
                      onChange={(e) => setFormData({ ...formData, grupo_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar grupo</option>
                      {grupos.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>
                          {grupo.nombre} - {grupo.institucion_nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="25"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Género
                      </label>
                      <select
                        value={formData.genero}
                        onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={formData.tipo_documento}
                        onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="CC">CC</option>
                        <option value="TI">TI</option>
                        <option value="RC">RC</option>
                        <option value="CE">CE</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento
                      </label>
                      <input
                        type="text"
                        value={formData.numero_documento}
                        onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      {editingEstudiante ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudiantesPage;