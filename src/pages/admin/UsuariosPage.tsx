import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Key,
  UserCheck,
  UserX
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  rol: 'admin' | 'docente' | 'estudiante';
  activo: boolean;
  created_at?: string;
  last_sign_in_at?: string;
}

const UsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'docente' as 'admin' | 'docente' | 'estudiante',
    password: '',
    activo: true
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      
      // Obtener usuarios de auth.users (requiere permisos especiales)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error al obtener usuarios de auth:', authError);
        // Fallback: obtener desde tabla de perfiles si existe
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) throw profilesError;
        
        const usuariosFromProfiles = (profilesData || []).map(profile => ({
          id: profile.id,
          email: profile.email || 'N/A',
          nombre: profile.nombre,
          apellido: profile.apellido,
          rol: profile.rol || 'docente',
          activo: profile.activo !== false,
          created_at: profile.created_at,
          last_sign_in_at: null
        }));
        
        setUsuarios(usuariosFromProfiles);
      } else {
        // Procesar usuarios de auth
        const usuariosFromAuth = authUsers.users.map(user => ({
          id: user.id,
          email: user.email || 'N/A',
          nombre: user.user_metadata?.nombre || user.user_metadata?.name,
          apellido: user.user_metadata?.apellido,
          rol: user.user_metadata?.rol || 'docente',
          activo: !user.banned_until,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        }));
        
        setUsuarios(usuariosFromAuth);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // Mostrar usuarios de ejemplo si hay error
      setUsuarios([
        {
          id: '1',
          email: 'admin@bulls.edu',
          nombre: 'Administrador',
          apellido: 'Sistema',
          rol: 'admin',
          activo: true,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUsuario) {
        // Actualizar usuario existente
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          editingUsuario.id,
          {
            email: formData.email,
            user_metadata: {
              nombre: formData.nombre,
              apellido: formData.apellido,
              rol: formData.rol
            }
          }
        );

        if (updateError) {
          // Fallback: actualizar en tabla profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: editingUsuario.id,
              email: formData.email,
              nombre: formData.nombre,
              apellido: formData.apellido,
              rol: formData.rol,
              activo: formData.activo
            });
          
          if (profileError) throw profileError;
        }
      } else {
        // Crear nuevo usuario
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            rol: formData.rol
          }
        });

        if (createError) {
          // Fallback: crear en tabla profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              email: formData.email,
              nombre: formData.nombre,
              apellido: formData.apellido,
              rol: formData.rol,
              activo: formData.activo
            });
          
          if (profileError) throw profileError;
        }
      }

      setShowModal(false);
      setEditingUsuario(null);
      setFormData({
        email: '',
        nombre: '',
        apellido: '',
        rol: 'docente',
        password: '',
        activo: true
      });
      loadUsuarios();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      email: usuario.email,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      rol: usuario.rol,
      password: '',
      activo: usuario.activo
    });
    setShowModal(true);
  };

  const handleToggleActive = async (usuario: Usuario) => {
    try {
      const newActiveState = !usuario.activo;
      
      if (newActiveState) {
        // Activar usuario
        await supabase.auth.admin.updateUserById(usuario.id, {
          banned_until: 'none'
        });
      } else {
        // Desactivar usuario
        await supabase.auth.admin.updateUserById(usuario.id, {
          banned_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 año
        });
      }
      
      loadUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        // Fallback: eliminar de profiles
        await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
      }
      
      loadUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = !selectedRol || usuario.rol === selectedRol;
    return matchesSearch && matchesRol;
  });

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'docente': return 'bg-blue-100 text-blue-800';
      case 'estudiante': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case 'admin': return 'Administrador';
      case 'docente': return 'Docente';
      case 'estudiante': return 'Estudiante';
      default: return rol;
    }
  };

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
                <Shield className="h-8 w-8 mr-3 text-orange-600" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-2">
                Administrar usuarios del sistema y sus permisos
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingUsuario(null);
                setFormData({
                  email: '',
                  nombre: '',
                  apellido: '',
                  rol: 'docente',
                  password: '',
                  activo: true
                });
                setShowModal(true);
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
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
                placeholder="Buscar por email, nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="docente">Docentes</option>
              <option value="estudiante">Estudiantes</option>
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Administradores</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredUsuarios.filter(u => u.rol === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Docentes</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredUsuarios.filter(u => u.rol === 'docente').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredUsuarios.filter(u => u.activo).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Inactivos</p>
                <p className="text-xl font-semibold text-gray-900">
                  {filteredUsuarios.filter(u => !u.activo).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Usuarios */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {usuario.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                          {getRolLabel(usuario.rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(usuario)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            usuario.activo 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {usuario.activo ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {usuario.last_sign_in_at 
                            ? new Date(usuario.last_sign_in_at).toLocaleDateString()
                            : 'Nunca'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id)}
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
                  {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol *
                    </label>
                    <select
                      required
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'docente' | 'estudiante' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="docente">Docente</option>
                      <option value="admin">Administrador</option>
                      <option value="estudiante">Estudiante</option>
                    </select>
                  </div>
                  
                  {!editingUsuario && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        required={!editingUsuario}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="activo"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                      Usuario activo
                    </label>
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
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      {editingUsuario ? 'Actualizar' : 'Crear'}
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

export default UsuariosPage;