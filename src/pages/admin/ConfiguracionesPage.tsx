import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  ArrowLeft,
  Save,
  Database,
  Mail,
  Shield,
  Bell,
  Palette,
  Globe,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ConfiguracionSistema {
  id?: string;
  nombre_sistema: string;
  version: string;
  email_soporte: string;
  url_base: string;
  timezone: string;
  idioma: string;
  tema_color: string;
  notificaciones_email: boolean;
  backup_automatico: boolean;
  retencion_logs_dias: number;
  max_estudiantes_grupo: number;
  duracion_sesion_minutos: number;
  created_at?: string;
  updated_at?: string;
}

const ConfiguracionesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  const [config, setConfig] = useState<ConfiguracionSistema>({
    nombre_sistema: 'BULL-S Analysis Platform',
    version: '2.0.0',
    email_soporte: 'soporte@bulls.edu',
    url_base: 'https://bulls.edu',
    timezone: 'America/Bogota',
    idioma: 'es',
    tema_color: 'blue',
    notificaciones_email: true,
    backup_automatico: true,
    retencion_logs_dias: 30,
    max_estudiantes_grupo: 50,
    duracion_sesion_minutos: 480
  });

  useEffect(() => {
    loadConfiguraciones();
  }, []);

  const loadConfiguraciones = async () => {
    try {
      setLoading(true);
      
      // Intentar cargar configuraciones desde la base de datos
      const { data, error } = await supabase
        .from('configuraciones_sistema')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error al cargar configuraciones:', error);
      } else if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const configToSave = {
        ...config,
        updated_at: new Date().toISOString()
      };

      // Intentar actualizar o insertar configuraciones
      const { error } = await supabase
        .from('configuraciones_sistema')
        .upsert(configToSave, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Configuraciones guardadas exitosamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar configuraciones:', error);
      setMessage({ type: 'error', text: 'Error al guardar las configuraciones' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ConfiguracionSistema, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'sistema', label: 'Sistema', icon: Database },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'apariencia', label: 'Apariencia', icon: Palette }
  ];

  const temas = [
    { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
    { value: 'green', label: 'Verde', color: 'bg-green-500' },
    { value: 'purple', label: 'Morado', color: 'bg-purple-500' },
    { value: 'red', label: 'Rojo', color: 'bg-red-500' },
    { value: 'orange', label: 'Naranja', color: 'bg-orange-500' }
  ];

  const timezones = [
    { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/Lima', label: 'Lima (GMT-5)' },
    { value: 'America/Santiago', label: 'Santiago (GMT-3)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' }
  ];

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
                <Settings className="h-8 w-8 mr-3 text-gray-600" />
                Configuraciones del Sistema
              </h1>
              <p className="text-gray-600 mt-2">
                Configurar parámetros generales y preferencias del sistema
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navegación de tabs */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenido de configuraciones */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Tab General */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración General</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Sistema
                          </label>
                          <input
                            type="text"
                            value={config.nombre_sistema}
                            onChange={(e) => handleInputChange('nombre_sistema', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Versión
                          </label>
                          <input
                            type="text"
                            value={config.version}
                            onChange={(e) => handleInputChange('version', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email de Soporte
                          </label>
                          <input
                            type="email"
                            value={config.email_soporte}
                            onChange={(e) => handleInputChange('email_soporte', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Base
                          </label>
                          <input
                            type="url"
                            value={config.url_base}
                            onChange={(e) => handleInputChange('url_base', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zona Horaria
                          </label>
                          <select
                            value={config.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Idioma
                          </label>
                          <select
                            value={config.idioma}
                            onChange={(e) => handleInputChange('idioma', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Sistema */}
                  {activeTab === 'sistema' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración del Sistema</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Máximo Estudiantes por Grupo
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={config.max_estudiantes_grupo}
                            onChange={(e) => handleInputChange('max_estudiantes_grupo', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duración de Sesión (minutos)
                          </label>
                          <input
                            type="number"
                            min="60"
                            max="1440"
                            value={config.duracion_sesion_minutos}
                            onChange={(e) => handleInputChange('duracion_sesion_minutos', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Retención de Logs (días)
                          </label>
                          <input
                            type="number"
                            min="7"
                            max="365"
                            value={config.retencion_logs_dias}
                            onChange={(e) => handleInputChange('retencion_logs_dias', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="backup_automatico"
                            checked={config.backup_automatico}
                            onChange={(e) => handleInputChange('backup_automatico', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="backup_automatico" className="ml-2 block text-sm text-gray-900">
                            Habilitar backup automático diario
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Notificaciones */}
                  {activeTab === 'notificaciones' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notificaciones_email"
                            checked={config.notificaciones_email}
                            onChange={(e) => handleInputChange('notificaciones_email', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="notificaciones_email" className="ml-2 block text-sm text-gray-900">
                            Habilitar notificaciones por email
                          </label>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Tipos de Notificaciones</h3>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <span className="ml-2 text-sm text-gray-700">Alertas críticas de bullying</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <span className="ml-2 text-sm text-gray-700">Reportes semanales</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <span className="ml-2 text-sm text-gray-700">Actualizaciones del sistema</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Seguridad */}
                  {activeTab === 'seguridad' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Seguridad</h2>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Configuraciones de Seguridad
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>Las configuraciones de seguridad avanzadas se gestionan a través de Supabase Auth.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Políticas de Contraseña</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Mínimo 6 caracteres</li>
                            <li>• Debe incluir letras y números</li>
                            <li>• Expiración cada 90 días (recomendado)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Configuraciones Actuales</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Autenticación de dos factores: Disponible</li>
                            <li>• Sesiones concurrentes: Limitadas</li>
                            <li>• Logs de auditoría: Habilitados</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Apariencia */}
                  {activeTab === 'apariencia' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Apariencia</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Tema de Color
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {temas.map((tema) => (
                            <button
                              key={tema.value}
                              onClick={() => handleInputChange('tema_color', tema.value)}
                              className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 ${
                                config.tema_color === tema.value 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${tema.color} mr-3`}></div>
                              <span className="text-sm font-medium">{tema.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Vista Previa</h3>
                        <div className="bg-white p-4 rounded border">
                          <div className={`h-2 ${config.tema_color === 'blue' ? 'bg-blue-500' : 
                                                config.tema_color === 'green' ? 'bg-green-500' :
                                                config.tema_color === 'purple' ? 'bg-purple-500' :
                                                config.tema_color === 'red' ? 'bg-red-500' :
                                                'bg-orange-500'} rounded mb-2`}></div>
                          <p className="text-sm text-gray-600">
                            Así se verán los elementos principales con el tema seleccionado.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionesPage;