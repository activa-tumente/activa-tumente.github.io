import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, User, Users, Activity, Shield, Info, Eye, Filter, Download, Calendar, ChevronDown, ChevronUp, X, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

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

interface BullyingIndicatorsProps {
  students: Student[];
  responses: Response[];
  filters: Record<string, string>;
}

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Componente que muestra los indicadores de bullying del grupo
 */
const BullyingIndicators: React.FC<BullyingIndicatorsProps> = ({ students, responses, filters }) => {
  const [bullyingData, setBullyingData] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [atRiskStudents, setAtRiskStudents] = useState<any[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Función para manejar cambios en los filtros locales
  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...localFilters };
    if (value) {
      newFilters[filterName] = value;
    } else {
      delete newFilters[filterName];
    }
    setLocalFilters(newFilters);
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setLocalFilters({});
  };

  // Función para exportar el informe como PDF
  const exportToPDF = async () => {
    if (!bullyingData || !reportRef.current) return;
    
    try {
      setIsExporting(true);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;
      
      // Título y encabezado
      pdf.setFontSize(18);
      pdf.setTextColor(0, 51, 153);
      pdf.text('Informe de Indicadores de Bullying', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
      
      yPos += 15;
      
      // Resumen de bullying
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Resumen de Bullying', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      pdf.text(`• Índice de Bullying: ${bullyingData.bullyingRate.toFixed(1)}%`, margin, yPos);
      yPos += 5;
      pdf.text(`• Víctimas: ${bullyingData.roles.find((r: any) => r.name === 'Víctimas')?.value || 0}`, margin, yPos);
      yPos += 5;
      pdf.text(`• Agresores: ${bullyingData.roles.find((r: any) => r.name === 'Agresores')?.value || 0}`, margin, yPos);
      yPos += 5;
      pdf.text(`• Observadores: ${bullyingData.roles.find((r: any) => r.name === 'Observadores')?.value || 0}`, margin, yPos);
      yPos += 5;
      pdf.text(`• No involucrados: ${bullyingData.roles.find((r: any) => r.name === 'No involucrados')?.value || 0}`, margin, yPos);
      
      yPos += 15;
      
      // Tipos de bullying
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Tipos de Bullying', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      bullyingData.types.forEach((type: any) => {
        pdf.text(`• ${type.name}: ${type.value} casos`, margin, yPos);
        yPos += 5;
      });
      
      yPos += 10;
      
      // Lugares de bullying
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Lugares de Bullying', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      bullyingData.places.forEach((place: any) => {
        pdf.text(`• ${place.name}: ${place.value} casos`, margin, yPos);
        yPos += 5;
      });
      
      // Nueva página para estudiantes en riesgo
      pdf.addPage();
      yPos = 20;
      
      // Estudiantes en riesgo
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Estudiantes en Situación de Riesgo', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      if (atRiskStudents.length > 0) {
        atRiskStudents.forEach((student) => {
          pdf.text(`• ${student.nombre} ${student.apellido}`, margin, yPos);
          yPos += 5;
          pdf.text(`   Índice como víctima: ${student.victimScore}`, margin, yPos);
          yPos += 5;
          pdf.text(`   Índice como agresor: ${student.bullyScore}`, margin, yPos);
          yPos += 5;
          pdf.text(`   Índice como observador: ${student.observerScore || 0}`, margin, yPos);
          yPos += 10;
        });
      } else {
        pdf.text('No se han identificado estudiantes en situación de riesgo', margin, yPos);
      }
      
      // Recomendaciones generales
      yPos += 15;
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Recomendaciones Generales', margin, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      const recommendations = [
        'Implementar un programa de prevención de bullying en el aula',
        'Realizar actividades de cohesión grupal para mejorar las relaciones entre estudiantes',
        'Establecer un sistema de reporte confidencial para situaciones de bullying',
        'Capacitar a los docentes en la detección temprana de situaciones de bullying',
        'Involucrar a las familias en la prevención del bullying'
      ];
      
      recommendations.forEach((rec) => {
        pdf.text(`• ${rec}`, margin, yPos);
        yPos += 5;
      });
      
      // Pie de página
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`BULLS - Informe generado el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, 285);
      }
      
      // Guardar el PDF
      pdf.save(`Informe_Bullying_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error al exportar el informe:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Filtrar estudiantes y respuestas según los filtros locales
  const filteredResponses = responses.filter(response => {
    // Filtrar por tipo de bullying
    if (localFilters.bullyingType && response.pregunta?.texto.includes('tipo de agresión')) {
      const types = response.respuesta.split(',').map(t => t.trim().toLowerCase());
      if (!types.includes(localFilters.bullyingType.toLowerCase())) {
        return false;
      }
    }
    
    // Filtrar por lugar
    if (localFilters.bullyingPlace && response.pregunta?.texto.includes('lugar donde ocurre')) {
      const places = response.respuesta.split(',').map(p => p.trim().toLowerCase());
      if (!places.includes(localFilters.bullyingPlace.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });
  
  const filteredStudents = students.filter(student => {
    // Filtrar por género
    if (localFilters.gender && student.genero !== localFilters.gender) {
      return false;
    }
    
    // Filtrar por edad
    if (localFilters.ageRange && student.edad) {
      const [minAge, maxAge] = localFilters.ageRange.split('-').map(Number);
      if (student.edad < minAge || student.edad > maxAge) {
        return false;
      }
    }
    
    return true;
  });

  // Procesar datos de bullying cuando cambian los estudiantes o respuestas
  useEffect(() => {
    if (students.length === 0 || responses.length === 0) return;
    
    // Usar estudiantes y respuestas filtrados si hay filtros activos
    const dataStudents = Object.keys(localFilters).length > 0 ? filteredStudents : students;
    const dataResponses = Object.keys(localFilters).length > 0 ? filteredResponses : responses;

    // Procesar respuestas para identificar indicadores de bullying
    const processBullyingData = () => {
      // Contadores para diferentes tipos de bullying
      const bullyingTypes: Record<string, number> = {
        'físico': 0,
        'verbal': 0,
        'social': 0,
        'psicológico': 0,
        'cibernético': 0,
        'otro': 0
      };

      // Contadores para lugares donde ocurre el bullying
      const bullyingPlaces: Record<string, number> = {
        'aula': 0,
        'patio': 0,
        'pasillos': 0,
        'baños': 0,
        'comedor': 0,
        'fuera del colegio': 0,
        'redes sociales': 0,
        'otro': 0
      };

      // Mapa de estudiantes y sus roles
      const studentRoles: Record<string, Record<string, number>> = {};
      dataStudents.forEach(student => {
        studentRoles[student.id] = {
          'víctima': 0,
          'agresor': 0,
          'observador': 0
        };
      });

      // Procesar respuestas relacionadas con bullying
      dataResponses.forEach(response => {
        // Identificar preguntas relacionadas con bullying
        if (response.pregunta?.categoria === 'bullying') {
          // Analizar tipo de bullying
          if (response.pregunta.texto.includes('tipo de agresión')) {
            const types = response.respuesta.split(',').map(t => t.trim().toLowerCase());
            types.forEach(type => {
              if (type in bullyingTypes) {
                bullyingTypes[type]++;
              } else {
                bullyingTypes['otro']++;
              }
            });
          }

          // Analizar lugares de bullying
          if (response.pregunta.texto.includes('lugar donde ocurre')) {
            const places = response.respuesta.split(',').map(p => p.trim().toLowerCase());
            places.forEach(place => {
              if (place in bullyingPlaces) {
                bullyingPlaces[place]++;
              } else {
                bullyingPlaces['otro']++;
              }
            });
          }

          // Identificar roles
          if (response.pregunta.texto.includes('víctima')) {
            const victims = response.respuesta.split(',').map(id => id.trim());
            victims.forEach(victimId => {
              if (studentRoles[victimId]) {
                studentRoles[victimId]['víctima']++;
              }
            });
          }

          if (response.pregunta.texto.includes('agresor') || response.pregunta.texto.includes('agresión')) {
            const bullies = response.respuesta.split(',').map(id => id.trim());
            bullies.forEach(bullyId => {
              if (studentRoles[bullyId]) {
                studentRoles[bullyId]['agresor']++;
              }
            });
          }

          if (response.pregunta.texto.includes('observador') || response.pregunta.texto.includes('presenciado')) {
            // El estudiante que responde es observador
            if (studentRoles[response.estudiante_id]) {
              studentRoles[response.estudiante_id]['observador']++;
            }
          }
        }
      });

      // Preparar datos para gráficos
      const typesData = Object.entries(bullyingTypes)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      const placesData = Object.entries(bullyingPlaces)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      // Identificar estudiantes en riesgo (alta puntuación como víctima)
      const riskStudents = dataStudents
        .map(student => ({
          ...student,
          victimScore: studentRoles[student.id]?.['víctima'] || 0,
          bullyScore: studentRoles[student.id]?.['agresor'] || 0,
          observerScore: studentRoles[student.id]?.['observador'] || 0,
          totalScore: (studentRoles[student.id]?.['víctima'] || 0) * 3 + (studentRoles[student.id]?.['agresor'] || 0) * 2
        }))
        .filter(student => student.victimScore > 0 || student.bullyScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore);

      setAtRiskStudents(riskStudents.slice(0, 5)); // Top 5 estudiantes en riesgo

      // Calcular distribución de roles
      const roleDistribution = [
        { name: 'Víctimas', value: dataStudents.filter(s => (studentRoles[s.id]?.['víctima'] || 0) > 0).length },
        { name: 'Agresores', value: dataStudents.filter(s => (studentRoles[s.id]?.['agresor'] || 0) > 0).length },
        { name: 'Observadores', value: dataStudents.filter(s => (studentRoles[s.id]?.['observador'] || 0) > 0).length },
        { name: 'No involucrados', value: dataStudents.filter(s => 
          (studentRoles[s.id]?.['víctima'] || 0) === 0 && 
          (studentRoles[s.id]?.['agresor'] || 0) === 0 && 
          (studentRoles[s.id]?.['observador'] || 0) === 0
        ).length }
      ];

      // Guardar todos los datos procesados
      setBullyingData({
        types: typesData,
        places: placesData,
        roles: roleDistribution,
        studentRoles,
        bullyingRate: dataStudents.length > 0 ? 
          (dataStudents.filter(s => 
            (studentRoles[s.id]?.['víctima'] || 0) > 0 || 
            (studentRoles[s.id]?.['agresor'] || 0) > 0
          ).length / dataStudents.length) * 100 : 0
      });
    };

    processBullyingData();
  }, [students, responses]);

  // Renderizar detalles del estudiante seleccionado
  const renderStudentDetails = () => {
    if (!selectedStudent || !bullyingData) return null;
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return null;
    
    const roles = bullyingData.studentRoles[student.id] || { 'víctima': 0, 'agresor': 0, 'observador': 0 };
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
        <h3 className="text-lg font-semibold mb-3">
          Perfil de Bullying: {student.nombre} {student.apellido}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Shield className="h-4 w-4 text-red-600 mr-1" />
              <h4 className="font-medium text-gray-800">Índice como Víctima</h4>
            </div>
            <p className="text-2xl font-bold text-red-700">{roles['víctima']}</p>
            <p className="text-xs text-gray-600">Menciones como víctima</p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
              <h4 className="font-medium text-gray-800">Índice como Agresor</h4>
            </div>
            <p className="text-2xl font-bold text-amber-700">{roles['agresor']}</p>
            <p className="text-xs text-gray-600">Menciones como agresor</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Eye className="h-4 w-4 text-blue-600 mr-1" />
              <h4 className="font-medium text-gray-800">Índice como Observador</h4>
            </div>
            <p className="text-2xl font-bold text-blue-700">{roles['observador']}</p>
            <p className="text-xs text-gray-600">Menciones como observador</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Recomendaciones</h4>
          {roles['víctima'] > 2 && (
            <div className="text-sm text-red-700 mb-2">
              <strong>Atención prioritaria:</strong> Este estudiante muestra un alto índice como víctima y requiere intervención inmediata.
            </div>
          )}
          {roles['agresor'] > 2 && (
            <div className="text-sm text-amber-700 mb-2">
              <strong>Intervención conductual:</strong> Este estudiante muestra un alto índice como agresor y requiere seguimiento.
            </div>
          )}
          {roles['víctima'] <= 2 && roles['agresor'] <= 2 && (
            <div className="text-sm text-gray-700">
              No se detectan patrones de riesgo significativos para este estudiante.
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!bullyingData) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">Procesando datos de bullying...</p>
      </div>
    );
  }

  return (
    <div ref={reportRef}>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div className="flex">
          <Info className="h-6 w-6 text-amber-600 mr-2" />
          <div>
            <h4 className="font-medium text-amber-800">Indicadores de Bullying</h4>
            <p className="text-sm text-amber-700">
              Este análisis muestra los patrones de bullying detectados en el grupo,
              identificando tipos, lugares y estudiantes en situación de riesgo.
            </p>
          </div>
        </div>
      </div>
      
      {/* Panel de filtros y exportación */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {Object.keys(localFilters).length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {Object.keys(localFilters).length}
              </span>
            )}
            {isFilterPanelOpen ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>
          
          {Object.keys(localFilters).length > 0 && (
            <button
              onClick={clearFilters}
              className="ml-2 flex items-center text-sm text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </button>
          )}
        </div>
        
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar Informe
            </>
          )}
        </button>
      </div>
      
      {/* Panel de filtros expandible */}
      {isFilterPanelOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3">Filtrar Indicadores de Bullying</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por tipo de bullying */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Tipo de Bullying</span>
                </div>
              </label>
              <select
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={localFilters.bullyingType || ''}
                onChange={(e) => handleFilterChange('bullyingType', e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="físico">Físico</option>
                <option value="verbal">Verbal</option>
                <option value="social">Social</option>
                <option value="psicológico">Psicológico</option>
                <option value="cibernético">Cibernético</option>
              </select>
            </div>
            
            {/* Filtro por lugar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Lugar</span>
                </div>
              </label>
              <select
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={localFilters.bullyingPlace || ''}
                onChange={(e) => handleFilterChange('bullyingPlace', e.target.value)}
              >
                <option value="">Todos los lugares</option>
                <option value="aula">Aula</option>
                <option value="patio">Patio</option>
                <option value="pasillos">Pasillos</option>
                <option value="baños">Baños</option>
                <option value="comedor">Comedor</option>
                <option value="fuera del colegio">Fuera del colegio</option>
                <option value="redes sociales">Redes sociales</option>
              </select>
            </div>
            
            {/* Filtro por género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Género</span>
                </div>
              </label>
              <select
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={localFilters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="">Todos los géneros</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            
            {/* Filtro por rango de edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Rango de Edad</span>
                </div>
              </label>
              <select
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={localFilters.ageRange || ''}
                onChange={(e) => handleFilterChange('ageRange', e.target.value)}
              >
                <option value="">Todas las edades</option>
                <option value="6-8">6-8 años</option>
                <option value="9-11">9-11 años</option>
                <option value="12-14">12-14 años</option>
                <option value="15-18">15-18 años</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Resumen de bullying */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-gray-800">Índice de Bullying</h4>
          </div>
          <p className="text-2xl font-bold text-red-700">{bullyingData.bullyingRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Estudiantes involucrados</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <User className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium text-gray-800">Víctimas</h4>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {bullyingData.roles.find((r: any) => r.name === 'Víctimas')?.value || 0}
          </p>
          <p className="text-sm text-gray-600">Estudiantes identificados</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-800">Agresores</h4>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {bullyingData.roles.find((r: any) => r.name === 'Agresores')?.value || 0}
          </p>
          <p className="text-sm text-gray-600">Estudiantes identificados</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-800">Observadores</h4>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {bullyingData.roles.find((r: any) => r.name === 'Observadores')?.value || 0}
          </p>
          <p className="text-sm text-gray-600">Estudiantes identificados</p>
        </div>
      </div>
      
      {/* Gráficos de distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribución por tipo de bullying */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-800 mb-4">Tipos de Bullying</h4>
          {bullyingData.types.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bullyingData.types}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
        
        {/* Distribución por lugar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-800 mb-4">Lugares de Bullying</h4>
          {bullyingData.places.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bullyingData.places}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Distribución de roles */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h4 className="font-medium text-gray-800 mb-4">Distribución de Roles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bullyingData.roles}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bullyingData.roles.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Estudiantes en Riesgo</h5>
            {atRiskStudents.length > 0 ? (
              <div className="space-y-2">
                {atRiskStudents.map(student => (
                  <div 
                    key={student.id}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedStudent(student.id === selectedStudent ? null : student.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.genero === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'} mr-2`}>
                          {student.nombre.charAt(0)}{student.apellido.charAt(0)}
                        </div>
                        <span className="font-medium">{student.nombre} {student.apellido}</span>
                      </div>
                      <div className="flex space-x-1">
                        {student.victimScore > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            V:{student.victimScore}
                          </span>
                        )}
                        {student.bullyScore > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            A:{student.bullyScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No se han identificado estudiantes en situación de riesgo</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Detalles del estudiante seleccionado */}
      {renderStudentDetails()}
    </div>
  );
};

export default BullyingIndicators;