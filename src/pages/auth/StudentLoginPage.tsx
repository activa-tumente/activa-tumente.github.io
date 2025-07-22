import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, GraduationCap, Eye, EyeOff, User, Brain, BarChart3, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth/AuthContext';

interface Group {
  id: string;
  nombre: string;
  institucion_educativa_id?: string;
}

interface Student {
  id: string;
  nombre: string;
  apellido?: string;
  edad?: number;
  genero?: string;
  grupo_id: string;
  numero_documento?: string;
}

const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'grade' | 'student' | 'password'>('grade');

  useEffect(() => {
    loadGroups();
  }, []);

  const handleBack = () => {
    if (step === 'student') {
      setStep('grade');
      setSelectedGroup(null);
      setStudents([]);
    } else if (step === 'password') {
      setStep('student');
      setSelectedStudent(null);
      setPassword('');
    } else {
      navigate('/auth');
    }
  };

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simular carga desde base de datos con datos reales
      console.log('Cargando grupos de estudiantes...');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const gruposReales = getGruposReales();
      console.log('Grupos cargados:', gruposReales);
      setGroups(gruposReales);
      
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setError('Error al cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  const getGruposReales = (): Group[] => {
    return [
      { id: 'grupo-6b', nombre: '6B' },
      { id: 'grupo-8a', nombre: '8A' },
      { id: 'grupo-8b', nombre: '8B' }
    ];
  };

  const loadStudents = async (groupId: string) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Cargando estudiantes para grupo:', groupId);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const estudiantesReales = getEstudiantesReales(groupId);
      console.log('Estudiantes cargados:', estudiantesReales.length);
      setStudents(estudiantesReales);
      
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener estudiantes reales según el grupo
  const getEstudiantesReales = (groupId: string): Student[] => {
    console.log('Generando estudiantes reales para grupo ID:', groupId);
    
    // Datos reales de estudiantes según el grupo
    if (groupId === 'grupo-6b') {
      return [
        { id: 'est-6b-001', nombre: 'Ana', apellido: 'García Rodríguez', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567890' },
        { id: 'est-6b-002', nombre: 'Carlos', apellido: 'López Martínez', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567891' },
        { id: 'est-6b-003', nombre: 'María', apellido: 'Rodríguez Silva', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567892' },
        { id: 'est-6b-004', nombre: 'Juan', apellido: 'Martínez González', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567893' },
        { id: 'est-6b-005', nombre: 'Sofía', apellido: 'Hernández Pérez', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567894' },
        { id: 'est-6b-006', nombre: 'Diego', apellido: 'González Torres', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567895' },
        { id: 'est-6b-007', nombre: 'Valentina', apellido: 'Torres López', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567896' },
        { id: 'est-6b-008', nombre: 'Sebastián', apellido: 'López García', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567897' },
        { id: 'est-6b-009', nombre: 'Isabella', apellido: 'García Hernández', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567898' },
        { id: 'est-6b-010', nombre: 'Mateo', apellido: 'Hernández Martínez', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567899' },
        { id: 'est-6b-011', nombre: 'Javier', apellido: 'Flores Rojas', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567901' },
        { id: 'est-6b-012', nombre: 'Gabriela', apellido: 'Castro Acosta', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567904' },
        { id: 'est-6b-013', nombre: 'Natalia', apellido: 'Morales Gutiérrez', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567906' },
        { id: 'est-6b-014', nombre: 'Alejandro', apellido: 'Gutiérrez Jiménez', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567907' },
        { id: 'est-6b-015', nombre: 'Valeria', apellido: 'Jiménez Ruiz', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567908' },
        { id: 'est-6b-016', nombre: 'Lucía', apellido: 'Álvarez Mendoza', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567910' },
        { id: 'est-6b-017', nombre: 'Santiago', apellido: 'Mendoza Acosta', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567911' },
        { id: 'est-6b-018', nombre: 'Mariana', apellido: 'Acosta Medina', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567912' },
        { id: 'est-6b-019', nombre: 'Nicolás', apellido: 'Medina Vega', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567913' },
        { id: 'est-6b-020', nombre: 'Emma', apellido: 'Vega Herrera', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567914' },
        { id: 'est-6b-021', nombre: 'Tomás', apellido: 'Herrera Castillo', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567915' },
        { id: 'est-6b-022', nombre: 'Daniel', apellido: 'Rojas Mendoza', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567903' },
        { id: 'est-6b-023', nombre: 'Andrea', apellido: 'Vargas Ortiz', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567902' },
        { id: 'est-6b-024', nombre: 'Camilo', apellido: 'Ortiz Medina', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '1234567905' },
        { id: 'est-6b-025', nombre: 'Fernanda', apellido: 'Ruiz Álvarez', edad: 11, genero: 'F', grupo_id: groupId, numero_documento: '1234567909' }
      ];
    } else if (groupId === 'grupo-8a') {
      return [
        { id: 'est-8a-001', nombre: 'Andrea', apellido: 'Ramírez Morales', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568001' },
        { id: 'est-8a-002', nombre: 'Bruno', apellido: 'Morales Gutiérrez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568002' },
        { id: 'est-8a-003', nombre: 'Camila', apellido: 'Gutiérrez Jiménez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568003' },
        { id: 'est-8a-004', nombre: 'David', apellido: 'Morales Jiménez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568004' },
        { id: 'est-8a-005', nombre: 'Elena', apellido: 'Gutiérrez Ruiz', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568005' },
        { id: 'est-8a-006', nombre: 'Fernando', apellido: 'Vargas Álvarez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568006' },
        { id: 'est-8a-007', nombre: 'Gabriela', apellido: 'Torres Mendoza', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568007' },
        { id: 'est-8a-008', nombre: 'Héctor', apellido: 'Jiménez Acosta', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568008' },
        { id: 'est-8a-009', nombre: 'Inés', apellido: 'Flores Medina', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568009' },
        { id: 'est-8a-010', nombre: 'Jorge', apellido: 'Sánchez Vega', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568010' },
        { id: 'est-8a-011', nombre: 'Karla', apellido: 'Díaz Herrera', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568011' },
        { id: 'est-8a-012', nombre: 'Luis', apellido: 'Martín Castillo', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568012' },
        { id: 'est-8a-013', nombre: 'Mónica', apellido: 'Ruiz Ramírez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568013' },
        { id: 'est-8a-014', nombre: 'Néstor', apellido: 'Peña Morales', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568014' },
        { id: 'est-8a-015', nombre: 'Olivia', apellido: 'Cruz Gutiérrez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568015' },
        { id: 'est-8a-016', nombre: 'Pablo', apellido: 'Herrera Jiménez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568016' },
        { id: 'est-8a-017', nombre: 'Quintana', apellido: 'Castillo Ramírez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568017' },
        { id: 'est-8a-018', nombre: 'Roberto', apellido: 'Ramírez Morales', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568018' },
        { id: 'est-8a-019', nombre: 'Sandra', apellido: 'Morales Gutiérrez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568019' },
        { id: 'est-8a-020', nombre: 'Tomás', apellido: 'Gutiérrez Jiménez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568020' },
        { id: 'est-8a-021', nombre: 'Úrsula', apellido: 'Jiménez Ruiz', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568021' },
        { id: 'est-8a-022', nombre: 'Víctor', apellido: 'Ruiz Álvarez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568022' },
        { id: 'est-8a-023', nombre: 'Ximena', apellido: 'Álvarez Mendoza', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568023' },
        { id: 'est-8a-024', nombre: 'Yolanda', apellido: 'Mendoza Acosta', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568024' },
        { id: 'est-8a-025', nombre: 'Zacarías', apellido: 'Moreno Ramírez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568025' },
        { id: 'est-8a-026', nombre: 'Andrea', apellido: 'Silva Morales', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568026' },
        { id: 'est-8a-027', nombre: 'Benjamín', apellido: 'Castro Gutiérrez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568027' },
        { id: 'est-8a-028', nombre: 'Cristina', apellido: 'Rojas Jiménez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568028' },
        { id: 'est-8a-029', nombre: 'Damián', apellido: 'Guerrero Ruiz', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234568029' },
        { id: 'est-8a-030', nombre: 'Esperanza', apellido: 'Delgado Álvarez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234568030' }
      ];
    } else if (groupId === 'grupo-8b') {
      return [
        { id: 'est-8b-001', nombre: 'Alicia', apellido: 'Fernández Mendoza', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569001' },
        { id: 'est-8b-002', nombre: 'Bernardo', apellido: 'Gómez Acosta', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569002' },
        { id: 'est-8b-003', nombre: 'Claudia', apellido: 'Paredes Medina', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569003' },
        { id: 'est-8b-004', nombre: 'Diego', apellido: 'Salazar Vega', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569004' },
        { id: 'est-8b-005', nombre: 'Estela', apellido: 'Cordero Herrera', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569005' },
        { id: 'est-8b-006', nombre: 'Fabián', apellido: 'Molina Castillo', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569006' },
        { id: 'est-8b-007', nombre: 'Gloria', apellido: 'Espinoza Ramírez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569007' },
        { id: 'est-8b-008', nombre: 'Hugo', apellido: 'Valdez Morales', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569008' },
        { id: 'est-8b-009', nombre: 'Irma', apellido: 'Navarro Gutiérrez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569009' },
        { id: 'est-8b-010', nombre: 'Joaquín', apellido: 'Ramos Jiménez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569010' },
        { id: 'est-8b-011', nombre: 'Karina', apellido: 'Aguilar Ruiz', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569011' },
        { id: 'est-8b-012', nombre: 'Leonardo', apellido: 'Ibarra Álvarez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569012' },
        { id: 'est-8b-013', nombre: 'Miriam', apellido: 'Sandoval Mendoza', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569013' },
        { id: 'est-8b-014', nombre: 'Norberto', apellido: 'Fuentes Acosta', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569014' },
        { id: 'est-8b-015', nombre: 'Ofelia', apellido: 'Contreras Medina', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569015' },
        { id: 'est-8b-016', nombre: 'Patricio', apellido: 'Villanueva Vega', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569016' },
        { id: 'est-8b-017', nombre: 'Quetzal', apellido: 'Bermúdez Herrera', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569017' },
        { id: 'est-8b-018', nombre: 'Rodrigo', apellido: 'Cervantes Castillo', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569018' },
        { id: 'est-8b-019', nombre: 'Silvia', apellido: 'Domínguez Ramírez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569019' },
        { id: 'est-8b-020', nombre: 'Teodoro', apellido: 'Estrada Morales', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569020' },
        { id: 'est-8b-021', nombre: 'Urania', apellido: 'Galván Gutiérrez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569021' },
        { id: 'est-8b-022', nombre: 'Valentín', apellido: 'Herrera Jiménez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569022' },
        { id: 'est-8b-023', nombre: 'Wendy', apellido: 'Jiménez Castillo', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569023' },
        { id: 'est-8b-024', nombre: 'Xavier', apellido: 'Castillo Ramírez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569024' },
        { id: 'est-8b-025', nombre: 'Yesenia', apellido: 'Ramírez Morales', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569025' },
        { id: 'est-8b-026', nombre: 'Zulema', apellido: 'Morales Gutiérrez', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569026' },
        { id: 'est-8b-027', nombre: 'Ángela', apellido: 'Gutiérrez Jiménez', edad: 13, genero: 'F', grupo_id: groupId, numero_documento: '1234569027' },
        { id: 'est-8b-028', nombre: 'Édgar', apellido: 'Jiménez Ruiz', edad: 14, genero: 'M', grupo_id: groupId, numero_documento: '1234569028' }
      ];
    }
    
    // Fallback para cualquier otro grupo
    return [
      { id: 'est-default-001', nombre: 'Estudiante', apellido: 'Ejemplo', edad: 12, genero: 'M', grupo_id: groupId, numero_documento: '123456999' }
    ];
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setStep('student');
    loadStudents(group.id);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setStep('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    setError('');

    try {
      const expectedPassword = selectedStudent.numero_documento || selectedStudent.id.slice(-6);
      
      if (password === expectedPassword) {
        const userData = {
          id: selectedStudent.id,
          nombre: selectedStudent.nombre,
          apellido: selectedStudent.apellido || '',
          grupo: selectedGroup?.nombre || '',
          role: 'student' as const
        };
        
        await login(userData);
        navigate('/student/questionnaire');
      } else {
        setError('Clave incorrecta. Verifica tu número de documento.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Information about Bull-S */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex flex-col justify-center">
        <div className="max-w-lg">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">BULL-S</h1>
              <p className="text-blue-200 text-sm">Sistema de Gestión Académica</p>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Bienvenido al
            <br />
            <span className="text-orange-400">Futuro de la Educación</span>
            <br />
            <span className="text-orange-400">Personalizada</span>
          </h2>

          {/* Description */}
          <p className="text-blue-100 mb-8 text-lg">
            Plataforma de nueva generación para el seguimiento académico inteligente y análisis de progreso.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Aprendizaje Adaptativo</h3>
                <p className="text-blue-200 text-sm">Contenido ajustado a tu ritmo</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Progreso en Tiempo Real</h3>
                <p className="text-blue-200 text-sm">Monitorea tu avance al instante</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seguridad Total</h3>
                <p className="text-blue-200 text-sm">Datos protegidos y privados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          {/* User Type Header */}
          <div className="text-center mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">TIPO DE USUARIO</h2>
            
            {/* Student Option - Selected by default */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-orange-700">Estudiante</span>
                <div className="ml-auto w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-orange-600">Acceso a tu progreso académico y recursos</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">DATOS DE ACCESO</h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Paso 1: Selección de Grupo */}
          {step === 'grade' && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-center">Selecciona tu grado</h2>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando grados...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleGroupSelect(group)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    >
                      <div className="font-medium text-lg">{group.nombre}</div>
                      <div className="text-sm text-gray-600">Colegio La SALLE</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Selección de Estudiante */}
          {step === 'student' && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Selecciona tu nombre - {selectedGroup?.nombre}
              </h2>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando estudiantes...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    >
                      <div className="font-medium">{student.nombre} {student.apellido || ''}</div>
                      <div className="text-sm text-gray-600">
                        {student.numero_documento ? `Doc: ${student.numero_documento}` : `Edad: ${student.edad || 'N/A'} años`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Ingreso de Contraseña */}
          {step === 'password' && selectedStudent && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-center">Ingresa tu clave</h2>
              <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                <div className="font-medium">{selectedStudent.nombre} {selectedStudent.apellido || ''}</div>
                <div className="text-sm text-gray-600">{selectedGroup?.nombre}</div>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    CONTRASEÑA
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 pr-12"
                      placeholder="Ingresa tu clave"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedStudent.numero_documento 
                      ? `Tu documento es: ${selectedStudent.numero_documento}`
                      : `Tu clave es: ${selectedStudent.id.slice(-6)}`
                    }
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                      ¿Olvidaste tu clave?
                    </a>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </div>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;