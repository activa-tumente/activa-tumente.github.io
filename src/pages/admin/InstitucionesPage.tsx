import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import sociometricService from '../../services/sociometricService';
import { supabase } from '../../lib/supabaseClient';

interface Institucion {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  created_at?: string;
  grupos_count?: number;
  estudiantes_count?: number;
}

const InstitucionesPage: React.FC = () => {
  const navigate = useNavigate();
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInstitucion, setEditingInstitucion] = useState<Institucion | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    loadInstituciones();
  }, []);

  const loadInstituciones = async () => {
    try {
      setLoading(true);
      const data = await sociometricService.getInstituciones();
      
      // Obtener conteos de grupos y estudiantes para cada institución
      const institucionesConConteos = await Promise.all(
        data.map(async (inst) => {
          try {
            // Contar grupos
            const { count: gruposCount } = await supabase
              .from('grupos')
              .select('*', { count: 'exact', head: true })
              .eq('institucion_id', inst.id);

            // Contar estudiantes a través de grupos
            const { data: grupos } = await supabase
              .from('grupos')
              .select('id')
              .eq('institucion_id', inst.id);

            let estudiantesCount = 0;
            if (grupos && grupos.length > 0) {
              const grupoIds = grupos.map(g => g.id);
              const { count } = await supabase
                .from('estudiantes')
                .select('*', { count: 'exact', head: true })
                .in('grupo_id', grupoIds);
              estudiantesCount = count || 0;
            }

            return {
              ...inst,
              grupos_count: gruposCount || 0,
              estudiantes_count: estudiantesCount
            };
          } catch (error) {
            console.error(`Error al obtener conteos para institución ${inst.id}:`, error);
            return {
              ...inst,
              grupos_count: 0,
              estudiantes_count: 0
            };
          }
        })
      );

      setInstituciones(institucionesConConteos);
    } catch (error) {
      console.error('Error al cargar instituciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingInstitucion) {
        // Actualizar institución existente
        const { error } = await supabase
          .from('instituciones')
          .update(formData)
          .eq('id', editingInstitucion.id);

        if (error) throw error;
      } else {
        // Crear nueva institución
        const { error } = await supabase
          .from('instituciones')
          .insert([formData]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingInstitucion(null);
      setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
      loadInstituciones();
    } catch (error) {
      console.error('Error al guardar institución:', error);
      alert('Error al guardar la institución');
    }
  };

  const handleEdit = (institucion: Institucion) => {
    setEditingInstitucion(institucion);
    setFormData({
      nombre: institucion.nombre,
      direccion: institucion.direccion || '',
      telefono: institucion.telefono || '',
      email: institucion.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta institución?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('instituciones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadInstituciones();
    } catch (error) {
      console.error('Error al eliminar institución:', error);
      alert('Error al eliminar la institución');
    }
  };

  const filteredInstituciones = instituciones.filter(inst =>
    inst.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Building2 className="h-8 w-8 mr-3 text-blue-600" />
                Gestión de Instituciones
              </h1>
              <p className="text-gray-600 mt-2">
                Administrar colegios y centros educativos del sistema
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingInstitucion(null);
                setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Institución
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar instituciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Instituciones */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredInstituciones.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No se encontraron instituciones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estadísticas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstituciones.map((institucion) => (
                    <tr key={institucion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {institucion.nombre}
                          </div>
                          {institucion.direccion && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {institucion.direccion}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {institucion.telefono && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {institucion.telefono}
                            </div>
                          )}
                          {institucion.email && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {institucion.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {institucion.grupos_count} grupos
                          </div>
                          <div className="text-sm text-gray-500">
                            {institucion.estudiantes_count} estudiantes
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(institucion)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(institucion.id)}
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
                  {editingInstitucion ? 'Editar Institución' : 'Nueva Institución'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingInstitucion ? 'Actualizar' : 'Crear'}
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

export default InstitucionesPage;