import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Eye, EyeOff, AlertCircle, GraduationCap, Brain, BarChart3, Shield, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth/AuthContext';

function StudentLoginPageSimple() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar grados desde Supabase
  useEffect(() => {
    loadGrades();
  }, []);

  // Cargar estudiantes cuando se selecciona un grado
  useEffect(() => {
    if (selectedGrade) {
      loadStudents(selectedGrade);
    } else {
      setStudents([]);
      setSelectedStudent('');
    }
  }, [selectedGrade]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      console.log('Cargando grados desde Supabase...');
      
      // Cargar desde Supabase
      const { data, error } = await supabase
        .from('grupos')
        .select('id, nombre, grado')
        .eq('institucion_id', '8a9ab6bb-4f0e-4eb9-905d-f16049464305')
        .order('nombre');

      if (error) {
        console.error('Error cargando grados desde Supabase:', error);
        setErrorMessage('Error al cargar los grados. Por favor, intenta de nuevo más tarde.');
        return;
      }

      if (data && data.length > 0) {
        console.log('Grados cargados desde Supabase:', data);
        setGrades(data);
      } else {
        console.error('No se encontraron grados en Supabase');
        setErrorMessage('No se encontraron grados disponibles. Por favor, contacta al administrador.');
      }
    } catch (error) {
      console.error('Error cargando grados:', error);
      setErrorMessage('Error al cargar los grados. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (gradeId) => {
    try {
      setLoading(true);
      console.log('Cargando estudiantes para grado:', gradeId);
      
      // Cargar estudiantes desde Supabase
      const { data, error } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante, numero_documento, edad, grado')
        .eq('grupo_id', gradeId)
        .order('nombre_estudiante');

      if (error) {
        console.error('Error cargando estudiantes desde Supabase:', error);
        setErrorMessage('Error al cargar los estudiantes. Por favor, intenta de nuevo más tarde.');
        return;
      }

      if (data && data.length > 0) {
        console.log('Estudiantes cargados desde Supabase:', data);
        setStudents(data);
      } else {
        console.error('No se encontraron estudiantes para el grado seleccionado');
        setErrorMessage('No se encontraron estudiantes para el grado seleccionado. Por favor, contacta al administrador.');
      }
      
      setSelectedStudent(''); // Resetear selección
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
      setErrorMessage('Error al cargar los estudiantes. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Autenticación directa con datos de Supabase
      const student = students.find(s => s.id === selectedStudent);

      if (student && student.numero_documento === password) {
        console.log('Autenticación exitosa para:', `${student.nombre_estudiante} ${student.apellido_estudiante}`);
        
        // Obtener información del grado seleccionado
        const selectedGradeInfo = grades.find(g => g.id === selectedGrade);
        
        // Guardar datos del estudiante en localStorage para mantener la sesión
        const studentSession = {
          id: student.id,
          name: `${student.nombre_estudiante} ${student.apellido_estudiante}`,
          documento: student.numero_documento,
          edad: student.edad,
          grado: selectedGradeInfo?.nombre || student.grado,
          grupoId: selectedGrade,
          role: 'student',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('student_session', JSON.stringify(studentSession));
        
        // Redirigir al cuestionario
        setTimeout(() => {
          console.log('Redirigiendo a /student/questionnaire...');
          navigate('/student/questionnaire', { replace: true });
        }, 100);
      } else {
        setErrorMessage('Grado, nombre de estudiante o clave incorrectos.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Information about BULL-S */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 rounded-full p-3 mr-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">BULL-S</h1>
              <p className="text-blue-200 text-lg">Sistema de Gestión Académica</p>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Bienvenido al Futuro de la 
            <span className="text-orange-400"> Educación Personalizada</span>
          </h2>

          {/* Description */}
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Plataforma de nueva generación para el seguimiento académico inteligente y análisis de progreso.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4 mt-1">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Aprendizaje Adaptativo</h3>
                <p className="text-blue-200">Contenido ajustado a tu ritmo.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4 mt-1">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Progreso en Tiempo Real</h3>
                <p className="text-blue-200">Monitorea tu avance al instante.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-500 rounded-full p-2 mr-4 mt-1">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Seguridad Total</h3>
                <p className="text-blue-200">Datos protegidos y privados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 bg-gray-50 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>

          {/* User Type Header */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              TIPO DE USUARIO
            </h2>
            
            {/* Student Option - Selected by default */}
            <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 relative">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-full p-2 mr-3">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Estudiante</h3>
                  <p className="text-sm text-gray-600">Acceso a tu progreso académico y recursos.</p>
                </div>
                <div className="absolute top-3 right-3 w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Grade Selection */}
            <div>
              <label htmlFor="grade-select" className="block text-sm font-medium text-gray-700 mb-2">
                Grado
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="grade-select"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Selecciona tu grado</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="student-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={!selectedGrade}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Selecciona tu nombre</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nombre_estudiante} {student.apellido_estudiante}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ingresa tu clave"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-orange-600 hover:text-orange-800">
                ¿Olvidaste tu clave?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedGrade || !selectedStudent || !password}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLoginPageSimple;