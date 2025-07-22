import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import sociometricService from '../../services/sociometricService';
import { supabase } from '../../lib/supabaseClient';

interface Grupo {
  id: string;
  nombre: string;
  institucion_id: string;
  institucion_nombre?: string;
  ano_escolar?: string;
  grado?: string;
  created_at?: string;
  estudiantes_count?: number;
}

interface Institucion {
  id: string;
  nombre: string;
}

const GruposPage: React.FC = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    institucion_id: '',
    ano_escolar: '',
    grado: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar instituciones
      const institucionesData = await sociometricService.getInstituciones();
      setInstituciones(institucionesData);
      
      // Cargar grupos con información de institución
      let gruposData;
      let error;
      
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
        error = result.error;
      } catch (e) {
        // Si falla, intentar con instituciones_educativas
        try {
          const result = await supabase
            .from('grupos')
            .select(`
              *,
              instituciones_educativas!inner(nombre)
            `)
            .order('nombre');
            
          gruposData = result.data;
          error = result.error;
          
          // Normalizar los datos para mantener la estructura esperada
          if (gruposData) {
            gruposData = gruposData.map(grupo => ({
              ...grupo,
              instituciones: grupo.instituciones_educativas
            }));
          }
        } catch (innerError) {
          console.error('Error al intentar con instituciones_educativas:', innerError);
          // Si ambos fallan, usar datos de ejemplo
          gruposData = await sociometricService.getGrupos();
          error = null;
        }
      }

      if (error) {
        console.error('Error al cargar grupos:', error);
        // Usar datos de ejemplo si hay error
        gruposData = sociometricService.getGruposEjemplo();
      }

      const gruposConConteo = await Promise.all(
        (gruposData || []).map(async (grupo) => {
          let estudiantesCount = 0;
          
          try {
            const { count } = await supabase
              .from('estudiantes')
              .select('*', { count: 'exact', head: true })
              .eq('grupo_id', grupo.id);
            estudiantesCount = count || 0;
          } catch (error) {
            console.error('Error contando estudiantes:', error);
            estudiantesCount = 0;
          }

          return {
            ...grupo,
            estudiantes_count: estudiantesCount,
            institucion_nombre: grupo.instituciones?.nombre || 'Colegio La SALLE'
          };
        })
      );

      setGrupos(gruposConConteo);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // En caso de error total, usar datos de ejemplo
      const gruposEjemplo = sociometricService.getGruposEjemplo();
      const gruposConConteos = gruposEjemplo.map(grupo => ({
        ...grupo,
        institucion_nombre: 'Colegio La SALLE',
        estudiantes_count: 0
      }));
      setGrupos(gruposConConteos);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Preparar datos básicos (siempre disponibles)
      const basicData = {
        nombre: formData.nombre,
        institucion_id: formData.institucion_id
      };

      // Intentar agregar campos adicionales si existen
      const dataToSend: any = { ...basicData };
      
      // Solo agregar campos adicionales si tienen valor
      if (formData.grado) {
        dataToSend.grado = formData.grado;
      }
      if (formData.ano_escolar) {
        dataToSend.ano_escolar = formData.ano_escolar;
      }

      if (editingGrupo) {
        // Actualizar grupo existente
        const { error } = await supabase
          .from('grupos')
          .update(dataToSend)
          .eq('id', editingGrupo.id);

        if (error) {
          // Si falla con campos adicionales, intentar solo con campos básicos
          if (error.code === 'PGRST204') {
            console.log('Columnas adicionales no encontradas, usando solo campos básicos');
            const { error: basicError } = await supabase
              .from('grupos')
              .update(basicData)
              .eq('id', editingGrupo.id);
            
            if (basicError) throw basicError;
          } else {
            throw error;
          }
        }
      } else {
        // Crear nuevo grupo
        const { error } = await supabase
          .from('grupos')
          .insert([dataToSend]);

        if (error) {
          // Si falla con campos adicionales, intentar solo con campos básicos
          if (error.code === 'PGRST204') {
            console.log('Columnas adicionales no encontradas, usando solo campos básicos');
            const { error: basicError } = await supabase
              .from('grupos')
              .insert([basicData]);
            
            if (basicError) throw basicError;
          } else {
            throw error;
          }
        }
      }

      setShowModal(false);
      setEditingGrupo(null);
      setFormData({ nombre: '', institucion_id: '', ano_escolar: '', grado: '' });
      loadData();
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      alert('Error al guardar el grupo. Verifique que la base de datos esté configurada correctamente.');
    }
  };

  const handleEdit = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    setFormData({
      nombre: grupo.nombre,
      institucion_id: grupo.institucion_id,
      ano_escolar: grupo.ano_escolar || '',
      grado: grupo.grado || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('grupos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      alert('Error al eliminar el grupo');
    }
  };

  const filteredGrupos = grupos.filter(grupo => {
    const matchesSearch = grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grupo.institucion_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitucion = !selectedInstitucion || grupo.institucion_id === selectedInstitucion;
    return matchesSearch && matchesInstitucion;
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
                <GraduationCap className="h-8 w-8 mr-3 text-green-600" />
                Gestión de Grupos
              </h1>
              <p className="text-gray-600 mt-2">
                Administrar grupos y cursos por institución educativa
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingGrupo(null);
                setFormData({ nombre: '', institucion_id: '', ano_escolar: '', grado: '' });
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Grupo
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
                placeholder="Buscar grupos o instituciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedInstitucion}
              onChange={(e) => setSelectedInstitucion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las instituciones</option>
              {instituciones.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Grupos */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : filteredGrupos.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No se encontraron grupos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGrupos.map((grupo) => (
                    <tr key={grupo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {grupo.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {grupo.institucion_nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {grupo.grado && (
                            <div className="text-sm text-gray-500">
                              Grado: {grupo.grado}
                            </div>
                          )}
                          {grupo.ano_escolar && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {grupo.ano_escolar}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {grupo.estudiantes_count} estudiantes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(grupo)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(grupo.id)}
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
                  {editingGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Grupo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: 6A, Séptimo B, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institución *
                    </label>
                    <select
                      required
                      value={formData.institucion_id}
                      onChange={(e) => setFormData({ ...formData, institucion_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seleccionar institución</option>
                      {instituciones.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grado
                    </label>
                    <input
                      type="text"
                      value={formData.grado}
                      onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: 6°, Séptimo, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año Escolar
                    </label>
                    <input
                      type="text"
                      value={formData.ano_escolar}
                      onChange={(e) => setFormData({ ...formData, ano_escolar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: 2024-2025"
                    />
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
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {editingGrupo ? 'Actualizar' : 'Crear'}
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

export default GruposPage;