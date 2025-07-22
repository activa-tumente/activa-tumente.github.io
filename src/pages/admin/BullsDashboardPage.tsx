import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, Users, AlertTriangle, MapPin, Brain, FileText, Download, Info, Award, ThumbsDown } from 'lucide-react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import DashboardTabs from '../../components/dashboard/DashboardTabs';

// Datos simulados basados en el informe
const kpiData = [
  { label: 'Total Estudiantes', value: '24', icon: Users },
  { label: 'Respuestas Válidas', value: '20', subtitle: '(83%)', icon: Users },
  { label: 'Rango de Edad', value: '10-12 años', icon: Users },
  { label: 'Cursos', value: '6A, 6B', icon: Users }
];

const electionsData = [
  { name: 'Raffaella Barrios', value: 25, grupo: '6A' },
  { name: 'María José Cañas', value: 20, grupo: '6A' },
  { name: 'Isabella Moreno', value: 17, grupo: '6B' },
  { name: 'Annie Méndez', value: 17, grupo: '6B' },
  { name: 'Luciana Ríos', value: 15, grupo: '6A' }
];

const rejectionsData = [
  { name: 'Paulina Bermúdez', value: 50, grupo: '6A' },
  { name: 'Luciana Ríos', value: 15, grupo: '6A' },
  { name: 'Isabella León', value: 11, grupo: '6B' },
  { name: 'Mía Cardozo', value: 11, grupo: '6B' },
  { name: 'María José Jiménez', value: 10, grupo: '6A' }
];

const bullyingRolesData = [
  { name: 'Isabella León', fuerte: 33, cobarde: 0, maltrato: 33, victima: 0, provocacion: 33, mania: 0, grupo: '6B' },
  { name: 'Mía Cardozo', fuerte: 33, cobarde: 0, maltrato: 22, victima: 0, provocacion: 22, mania: 0, grupo: '6B' },
  { name: 'Paulina Bermúdez', fuerte: 0, cobarde: 55, maltrato: 0, victima: 20, provocacion: 0, mania: 35, grupo: '6A' },
  { name: 'Valeria Ortiz', fuerte: 20, cobarde: 0, maltrato: 10, victima: 0, provocacion: 15, mania: 0, grupo: '6A' },
  { name: 'María Paula Amaya', fuerte: 0, cobarde: 33, maltrato: 0, victima: 11, provocacion: 0, mania: 11, grupo: '6B' }
];

const aggressionTypesData = [
  { name: 'Insultos/Amenazas', value: 42, color: '#ef4444' },
  { name: 'Rechazo', value: 26, color: '#f97316' },
  { name: 'Ignorar', value: 16, color: '#eab308' },
  { name: 'Rumores', value: 11, color: '#84cc16' },
  { name: 'Maltrato Físico', value: 5, color: '#dc2626' }
];

const aggressionPlacesData = [
  { name: 'Aula', value: 58, color: '#3b82f6' },
  { name: 'Patio', value: 21, color: '#06b6d4' },
  { name: 'Pasillos', value: 11, color: '#8b5cf6' },
  { name: 'Baños', value: 5, color: '#ec4899' },
  { name: 'Otros', value: 5, color: '#6b7280' }
];

const frequencyData = [
  { name: 'Nunca', value: 21, color: '#10b981' },
  { name: '1-2 veces/semana', value: 42, color: '#f59e0b' },
  { name: 'Diariamente', value: 16, color: '#ef4444' },
  { name: 'Varias veces/día', value: 11, color: '#dc2626' },
  { name: 'No responde', value: 10, color: '#6b7280' }
];

const BullsDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedGroup, setSelectedGroup] = useState('todos');

  const tabs = [
    { id: 'general', label: 'Información General', icon: Info },
    { id: 'dimension1', label: 'Aceptación/Rechazo', icon: Users },
    { id: 'dimension2', label: 'Dinámica Bullying', icon: AlertTriangle },
    { id: 'dimension3', label: 'Variables Situacionales', icon: MapPin },
    { id: 'conclusions', label: 'Conclusiones', icon: Brain }
  ];

  const findings = [
    {
      title: 'Patrones de agresión claramente definidos',
      description: 'Se identificaron perfiles específicos de agresores en ambos grupos, con Isabella León y Mía Cardozo destacando en 6B (33% cada una percibidas como "fuertes") y Valeria Ortiz, Luciana Ríos y María José Jiménez formando un triángulo de agresión en 6A.'
    },
    {
      title: 'Víctimas vulnerables y aisladas',
      description: 'Paulina Bermúdez en 6A emerge como la víctima más identificada (55% la considera "cobarde", 20% la señala como víctima de maltrato y 35% indica que "se le tiene manía"), mientras que María Paula Amaya presenta un perfil similar en 6B.'
    },
    {
      title: 'Agresión predominantemente psicológica',
      description: 'Las formas principales de acoso son insultos/amenazas (42%) y rechazo (26%), con el maltrato físico representando solo un 5% de los casos.'
    },
    {
      title: 'El aula como escenario principal',
      description: 'El 58% de las agresiones ocurren en el aula, contradiciendo la percepción común de que el bullying sucede en espacios no supervisados.'
    }
  ];

  const recommendations = [
    {
      title: 'Intervención focalizada',
      description: 'Implementar programas específicos para agresores centrados en desarrollo de empatía y resolución de conflictos, y apoyo psicológico para víctimas orientado al fortalecimiento de autoestima y asertividad.'
    },
    {
      title: 'Reestructuración de espacios',
      description: 'Reorganizar periódicamente la distribución física del aula y establecer un sistema de vigilancia activa durante momentos de transición.'
    },
    {
      title: 'Programa de alfabetización emocional',
      description: 'Desarrollar talleres vivenciales sobre el impacto del maltrato verbal y relacional, con especial atención a las formas predominantes detectadas.'
    },
    {
      title: 'Seguimiento sistemático',
      description: 'Reaplicar el Test BULL-S en 3-4 meses para evaluar la efectividad de las intervenciones y establecer un sistema de monitoreo continuo.'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard: Análisis Test BULL-S (Colegio la SALLE)
              </h1>
              <p className="text-gray-600 mt-1">
                Evaluación de la Agresividad entre Escolares - Grupos 6A y 6B
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los grupos</option>
                <option value="6a">Grupo 6A</option>
                <option value="6b">Grupo 6B</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Exportar Informe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {kpi.value} {kpi.subtitle && <span className="text-sm text-gray-500">{kpi.subtitle}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Descripción del Estudio */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción del Estudio</h3>
              <p className="text-gray-700 mb-4">
                Este análisis presenta los resultados del Test BULL-S aplicado a estudiantes de 6° grado, 
                una herramienta diseñada para evaluar las dinámicas de agresividad y bullying entre escolares. 
                El test analiza tres dimensiones principales: relaciones de aceptación/rechazo entre los estudiantes, 
                dinámica de bullying (agresores y víctimas), y variables situacionales del fenómeno.
              </p>
              <p className="text-gray-700">
                Los datos han sido recogidos mediante cuestionarios completados por 20 estudiantes de los cursos 6A y 6B, 
                con edades entre 10 y 12 años. El análisis identifica patrones de relaciones, perfiles de posibles 
                agresores y víctimas, así como características principales de las agresiones.
              </p>
            </div>

            {/* Hallazgos y Recomendaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hallazgos Principales */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Hallazgos Principales
                </h3>
                <ul className="space-y-3">
                  {findings.map((finding, index) => (
                    <li key={index} className="border-l-4 border-orange-200 pl-4">
                      <h4 className="font-medium text-gray-900">{finding.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recomendaciones Clave */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-green-500 mr-2" />
                  Recomendaciones Clave
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="border-l-4 border-green-200 pl-4">
                      <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Dimensión I: Aceptación/Rechazo */}
        {activeTab === 'dimension1' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Elecciones Recibidas */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4">Elecciones Recibidas</h3>
                <p className="text-sm text-gray-600 mb-4">Estudiantes más elegidos como compañeros de grupo</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={electionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Rechazos Recibidos */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Rechazos Recibidos</h3>
                <p className="text-sm text-gray-600 mb-4">Estudiantes más rechazados como compañeros de grupo</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rejectionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Análisis de Estudiantes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  Estudiantes Populares
                </h3>
                <p className="text-sm text-gray-600 mb-4">Alta aceptación, bajo rechazo</p>
                <ul className="space-y-2">
                  <li className="flex items-center p-2 bg-green-50 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Raffaella Barrios</div>
                      <div className="text-sm text-gray-600">25% elecciones, 0% rechazos</div>
                    </div>
                  </li>
                  <li className="flex items-center p-2 bg-green-50 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Isabella Moreno</div>
                      <div className="text-sm text-gray-600">17% elecciones, 0% rechazos</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />
                  Estudiantes Rechazados
                </h3>
                <p className="text-sm text-gray-600 mb-4">Alto rechazo, baja aceptación</p>
                <ul className="space-y-2">
                  <li className="flex items-center p-2 bg-red-50 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Paulina Bermúdez</div>
                      <div className="text-sm text-gray-600">0% elecciones, 50% rechazos</div>
                    </div>
                  </li>
                  <li className="flex items-center p-2 bg-red-50 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Luciana Ríos</div>
                      <div className="text-sm text-gray-600">15% elecciones, 15% rechazos</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nivel de Cohesión</h3>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                    <span className="text-lg font-bold text-orange-600">BAJO</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pocas elecciones recíprocas, formación de pequeños subgrupos aislados entre sí
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dimensión II: Dinámica Bullying */}
        {activeTab === 'dimension2' && (
          <div className="space-y-6">
            {/* Perfil de Roles de Bullying */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Roles de Bullying</h3>
              <p className="text-sm text-gray-600 mb-4">Análisis multidimensional de los estudiantes clave</p>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={bullyingRolesData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={90} domain={[0, 60]} />
                  <Radar name="Fuerte" dataKey="fuerte" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Radar name="Maltrato" dataKey="maltrato" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  <Radar name="Víctima" dataKey="victima" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Análisis por Roles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Más Fuertes</h3>
                <p className="text-sm text-gray-600 mb-4">Estudiantes percibidos como los más fuertes del grupo</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bullyingRolesData.filter(d => d.fuerte > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="fuerte" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-yellow-600 mb-4">Cobardes</h3>
                <p className="text-sm text-gray-600 mb-4">Estudiantes percibidos como cobardes o infantiles</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bullyingRolesData.filter(d => d.cobarde > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cobarde" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Dimensión III: Variables Situacionales */}
        {activeTab === 'dimension3' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formas de Agresión */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Agresión</h3>
                <p className="text-sm text-gray-600 mb-4">Tipos de agresión más frecuentes</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={aggressionTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {aggressionTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lugares de Agresión */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lugares de Agresión</h3>
                <p className="text-sm text-gray-600 mb-4">Espacios donde ocurren las agresiones</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={aggressionPlacesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {aggressionPlacesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Frecuencia de Agresiones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frecuencia de Agresiones</h3>
              <p className="text-sm text-gray-600 mb-4">Con qué frecuencia ocurren las agresiones</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Conclusiones */}
        {activeTab === 'conclusions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                Conclusiones del Análisis
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Situación General</h4>
                  <p className="text-gray-700">
                    El análisis revela la presencia de dinámicas de bullying claramente establecidas en ambos grupos, 
                    con patrones específicos de agresión y victimización que requieren intervención inmediata y sistemática.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Factores de Riesgo Identificados</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Baja cohesión grupal que facilita la exclusión</li>
                    <li>Normalización de la agresión psicológica</li>
                    <li>Ausencia de mecanismos efectivos de denuncia</li>
                    <li>Concentración de agresiones en espacios supervisados</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Oportunidades de Intervención</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Identificación clara de agresores y víctimas</li>
                    <li>Presencia de estudiantes con liderazgo positivo</li>
                    <li>Predominio de agresión psicológica sobre física</li>
                    <li>Disposición institucional para el cambio</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Próximos Pasos</h4>
                  <p className="text-gray-700">
                    Se recomienda implementar un plan de intervención integral que incluya trabajo individual con 
                    estudiantes identificados, reestructuración de dinámicas grupales, capacitación docente y 
                    seguimiento sistemático de la evolución de las relaciones interpersonales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BullsDashboardPage;