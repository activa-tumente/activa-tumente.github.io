import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { saveResponse } from '../../lib/localStorageHelper';
import { studentsApi, groupsApi, responsesApi, optionsApi } from '../../lib/api';
import { questionnaireQuestions } from '../../lib/questionnaireData';
import type { QuestionOption } from '../../lib/questionnaireData';
import type { Answer, QuestionnaireResponse } from '../../types/data';
import { getQuestionUuid } from '../../lib/questionIdMapping';

import PeerSelector from '../../components/questionnaire/PeerSelector';
import CheckboxGroupWithOther from '../../components/questionnaire/CheckboxGroupWithOther';
import QuestionnaireNavigation from '../../components/questionnaire/QuestionnaireNavigation';

import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Mejores definiciones de tipos para manejar diferentes tipos de respuestas
type SingleChoiceAnswer = string;
type PeerSelectorAnswer = QuestionOption[];
type CheckboxWithOtherAnswer = { selected: string[]; other: string };

// Define estructura mejorada para el estado de respuestas
interface AnswersState {
  [key: string]: SingleChoiceAnswer | PeerSelectorAnswer | CheckboxWithOtherAnswer;
}

// Funciones auxiliares de tipado
function isPeerSelectorAnswer(answer: any): answer is PeerSelectorAnswer {
  return Array.isArray(answer) && (answer.length === 0 || 'value' in (answer[0] || {}));
}

function isCheckboxWithOtherAnswer(answer: any): answer is CheckboxWithOtherAnswer {
  return typeof answer === 'object' && answer !== null && 'selected' in answer && 'other' in answer;
}

const QuestionnairePage: React.FC = () => {
  const { groupId, studentId } = useParams<{ groupId: string; studentId: string }>();
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optionsMap, setOptionsMap] = useState<Record<string, Record<string, string>>>({});
  const [studentSession, setStudentSession] = useState<any>(null);

  // Memoize current question object
  const currentQuestion = useMemo(() => questionnaireQuestions[currentQuestionIndex], [currentQuestionIndex]);

  // Load options data on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Obtener todas las opciones de respuesta
        const allOptions = await optionsApi.getAll();

        // Crear un mapa de pregunta_id -> texto -> id
        const optionsMapping: Record<string, Record<string, string>> = {};

        allOptions.forEach(option => {
          if (!optionsMapping[option.pregunta_id]) {
            optionsMapping[option.pregunta_id] = {};
          }
          optionsMapping[option.pregunta_id][option.texto] = option.id;
        });

        setOptionsMap(optionsMapping);
        console.log('Opciones de respuesta cargadas:', optionsMapping);
      } catch (err) {
        console.error('Error cargando opciones de respuesta:', err);
        // No establecemos error aquí para no bloquear el cuestionario
      }
    };

    loadOptions();
  }, []);

  // Load student and group data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Primero intentar cargar desde la sesión local
        const sessionData = localStorage.getItem('student_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          console.log('Datos de sesión del estudiante:', session);

          setStudentSession(session);
          setStudentName(session.name);
          setGroupName(session.grado);
          setLoading(false);
          return;
        }

        // Si no hay sesión local, intentar cargar desde parámetros de ruta (modo base de datos)
        if (groupId && studentId) {
          // Cargar información del estudiante
          const student = await studentsApi.getById(studentId);

          if (student) {
            setStudentName(`${student.nombre_estudiante} ${student.apellido_estudiante}`);
          } else {
            setError('No se pudo encontrar la información del estudiante.');
          }

          // Cargar información del grupo
          const group = await groupsApi.getById(groupId);

          if (group) {
            setGroupName(group.nombre);
          } else {
            console.warn('No se pudo encontrar la información del grupo.');
          }
        } else {
          setError('No hay sesión de estudiante activa. Por favor, inicia sesión nuevamente.');
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupId, studentId]);

  // Calculate classmates dynamically only when the current question is a peer selector
  const [currentClassmates, setCurrentClassmates] = useState<QuestionOption[]>([]);

  // Efecto para cargar los compañeros de clase cuando sea necesario
  useEffect(() => {
    const loadClassmates = async () => {
      // Check if the current question requires peers
      if (currentQuestion.type === 'peer_selector') {
        
        // Validación temprana: Si no tenemos groupId/studentId Y tampoco studentSession, esperar
        if ((!groupId || !studentId) && !studentSession) {
          // Esto es normal durante la inicialización en React StrictMode (desarrollo)
          // No mostrar error, simplemente esperar a que se carguen los datos
          setCurrentClassmates([]);
          return;
        }
        try {
          // Obtener el ID del grupo y el ID del estudiante
          let currentGroupId = groupId;
          let currentStudentId = studentId;

          // Si tenemos sesión local, necesitamos obtener los IDs reales de Supabase
          if (studentSession && (!groupId || !studentId)) {
            console.log('Obteniendo IDs reales para cargar compañeros de clase...');
            console.log('Datos de sesión del estudiante:', studentSession);

            try {
              // SOLUCIÓN SIMPLIFICADA: Buscar el estudiante directamente por número de documento
              // El estudiante ya tiene su grupo_id asignado en la base de datos
              console.log(`Buscando estudiante con documento: "${studentSession.documento}"`);
              const { data: estudianteData, error: estudianteError } = await supabase
                .from('estudiantes')
                .select('id, grupo_id, nombre_estudiante, apellido_estudiante, grado')
                .eq('numero_documento', studentSession.documento)
                .single();

              if (estudianteError) {
                console.error('Error buscando estudiante:', estudianteError);
                throw new Error(`Error buscando estudiante: ${estudianteError.message}`);
              }

              if (!estudianteData) {
                throw new Error(`No se encontró el estudiante con documento ${studentSession.documento}`);
              }

              console.log('Estudiante encontrado:', estudianteData);
              
              // Usar los IDs directamente del estudiante
              currentStudentId = estudianteData.id;
              currentGroupId = estudianteData.grupo_id;
              
              console.log(`IDs obtenidos - Estudiante: ${currentStudentId}, Grupo: ${currentGroupId}`);
            } catch (error) {
              console.error('Error obteniendo IDs reales:', error);
              // Continuar con los IDs que tengamos
            }
          }

          // Cargar estudiantes desde Supabase usando los IDs que tengamos
          if (currentGroupId) {
            console.log(`Cargando compañeros de clase desde Supabase para grupo: ${currentGroupId}`);

            // Fetch students from Supabase
            const { data: allStudents, error: studentsError } = await supabase
              .from('estudiantes')
              .select('id, nombre_estudiante, apellido_estudiante, grado')
              .eq('grupo_id', currentGroupId);

            if (studentsError) {
              throw new Error(`Error cargando estudiantes: ${studentsError.message}`);
            }

            if (!allStudents || allStudents.length === 0) {
              console.warn('No se encontraron estudiantes para el grupo seleccionado');
              setCurrentClassmates([]);
              return;
            }

            console.log(`[QuestionnairePage] Encontrados ${allStudents.length} estudiantes para el grupo ${currentGroupId}`);

            // Transform to the format needed for the selector
            const classmates = allStudents
              .filter((s) => s.id !== currentStudentId) // Exclude self if we have the ID
              .map((s) => ({
                value: s.id,
                label: `${s.nombre_estudiante} ${s.apellido_estudiante}` // Mostrar nombre completo
              }));

            console.log(`[QuestionnairePage] Compañeros de clase cargados:`, classmates);
            setCurrentClassmates(classmates);
          } else {
            console.error('No se pudo obtener el ID del grupo para cargar compañeros de clase');
            console.error('Valores actuales:', {
              currentGroupId,
              groupId,
              studentSession: studentSession ? {
                documento: studentSession.documento,
                grado: studentSession.grado,
                name: studentSession.name
              } : null
            });
            setCurrentClassmates([]);
          }
        } catch (err) {
          console.error('Error al cargar compañeros de clase:', err);
          setCurrentClassmates([]);
        }
      }
    };

    loadClassmates();
  }, [currentQuestion.type, groupId, studentId, studentSession]);

  // Generic answer handler
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers: AnswersState) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Validation function
  const isCurrentQuestionAnswered = (): boolean => {
    const answer = answers[currentQuestion.id];
    if (answer === undefined || answer === null) return false;

    switch (currentQuestion.type) {
      case 'single_choice':
        return typeof answer === 'string' && answer.trim() !== '';
      case 'peer_selector':
        // Verificar que sea un array de PeerSelectorAnswer
        return isPeerSelectorAnswer(answer) &&
          answer.length <= (currentQuestion.maxSelections ?? 3);
      case 'checkbox_group_with_other':
        // Verificar que sea un CheckboxWithOtherAnswer válido
        if (!isCheckboxWithOtherAnswer(answer)) return false;
        return (
          (Array.isArray(answer.selected) && answer.selected.length > 0) ||
          (typeof answer.other === 'string' && answer.other.trim() !== '')
        );
      default:
        return false;
    }
  };

  // More robust validation for submission
  const validateAllAnswers = (): boolean => {
    for (const question of questionnaireQuestions) {
      const answer = answers[question.id];

      // Verificar si hay una respuesta
      if (answer === undefined || answer === null) {
        console.warn(`Validation failed: Question ${question.id} has no answer.`);
        return false;
      }

      // Para preguntas 1-10 (peer_selector), se requieren exactamente 3 respuestas
      if (question.type === 'peer_selector' && isPeerSelectorAnswer(answer)) {
        const questionNumber = parseInt(question.id.replace('q', ''));
        if (questionNumber >= 1 && questionNumber <= 10) {
          if (answer.length !== 3) {
            console.warn(`Validation failed: Question ${question.id} requires exactly 3 selections, but has ${answer.length}`);
            return false;
          }
        } else if (answer.length === 0) {
          continue; // Empty array is valid for other peer selector questions
        }
      }

      switch (question.type) {
        case 'single_choice':
          if (!(typeof answer === 'string' && answer.trim() !== '')) {
            console.warn(`Validation failed: single_choice ${question.id} is invalid:`, answer);
            return false;
          }
          break;
        case 'peer_selector':
          if (!isPeerSelectorAnswer(answer) ||
            answer.length > (question.maxSelections ?? 3)) {
            console.warn(`Validation failed: peer_selector ${question.id} is invalid:`, answer);
            return false;
          }
          break;
        case 'checkbox_group_with_other':
          if (!isCheckboxWithOtherAnswer(answer)) {
            console.warn(`Validation failed: checkbox_group_with_other ${question.id} is not properly structured:`, answer);
            return false;
          }
          if (!(
            (Array.isArray(answer.selected) && answer.selected.length > 0) ||
            (typeof answer.other === 'string' && answer.other.trim() !== '')
          )) {
            console.warn(`Validation failed: checkbox_group_with_other ${question.id} is invalid:`, answer);
            return false;
          }
          break;
        default:
          console.warn(`Validation failed: Unknown question type for ${question.id}`);
          return false;
      }
    }
    console.log("Validation passed for all answers.");
    return true;
  };

  const goToNextQuestion = () => {
    // Validación especial para preguntas 1-10 (peer_selector)
    if (currentQuestion.type === 'peer_selector') {
      const questionNumber = parseInt(currentQuestion.id.replace('q', ''));
      const answer = answers[currentQuestion.id];
      
      if (questionNumber >= 1 && questionNumber <= 10) {
        if (!isPeerSelectorAnswer(answer) || answer.length !== 3) {
          alert('Por favor, selecciona exactamente 3 compañeros antes de continuar.');
          return;
        }
      }
    } else if (!isCurrentQuestionAnswered()) {
      alert('Por favor, responde la pregunta actual antes de continuar.');
      return;
    }
    
    if (currentQuestionIndex < questionnaireQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Use the more robust validation
    if (!validateAllAnswers()) {
      alert(`Por favor, asegúrate de haber respondido todas las preguntas correctamente antes de finalizar.`);
      // Find first unanswered/invalid question and navigate
      const firstInvalidIndex = questionnaireQuestions.findIndex((q) => {
        const answer = answers[q.id];
        if (answer === undefined || answer === null) {
          return true; // Missing answer
        }
        // Excepción para selector de compañeros con array vacío
        if (q.type === 'peer_selector' && isPeerSelectorAnswer(answer) && answer.length === 0) {
          return false; // Array vacío es válido para peer selector
        }
        // Para la pregunta actual, usa la función de validación
        if (q.id === currentQuestion.id) {
          return !isCurrentQuestionAnswered();
        }
        // Para otras preguntas, haz una validación básica según el tipo
        switch (q.type) {
          case 'single_choice':
            return !(typeof answer === 'string' && answer.trim() !== '');
          case 'checkbox_group_with_other':
            if (!isCheckboxWithOtherAnswer(answer)) return true;
            return !(
              (Array.isArray(answer.selected) && answer.selected.length > 0) ||
              (typeof answer.other === 'string' && answer.other.trim() !== '')
            );
          default:
            return false;
        }
      });
      if (firstInvalidIndex !== -1) {
        console.log(`Navigating to first invalid question index: ${firstInvalidIndex}`);
        setCurrentQuestionIndex(firstInvalidIndex);
      }
      return;
    }

    // Verificar si tenemos datos esenciales (modo local o base de datos)
    const hasLocalSession = studentSession && studentSession.id && studentSession.name;
    const hasDatabaseIds = groupId && studentId && studentName;

    if (!hasLocalSession && !hasDatabaseIds) {
      setError("Faltan datos esenciales (grupo, estudiante) para guardar la respuesta.");
      return;
    }

    // --- Transform answers for storage ---
    const finalAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => {
      const question = questionnaireQuestions.find(q => q.id === questionId);
      let finalValue: any = value;

      // Para peer selector, guardar solo los IDs de estudiantes (valores) en orden
      if (question?.type === 'peer_selector' && isPeerSelectorAnswer(value)) {
        finalValue = value.map((option) => option.value);
      }

      // Asegurar que la estructura del checkbox group es consistente
      if (question?.type === 'checkbox_group_with_other' && isCheckboxWithOtherAnswer(value)) {
        finalValue = {
          selected: Array.isArray(value.selected) ? value.selected : [],
          other: typeof value.other === 'string' ? value.other : ''
        };
      }

      return { questionId, value: finalValue };
    });

    // Crear respuesta usando datos locales o de base de datos
    let finalGroupId = hasLocalSession ? studentSession.grado : groupId;
    let finalStudentId = hasLocalSession ? studentSession.id : studentId;
    const finalStudentName = hasLocalSession ? studentSession.name : studentName;

    const response: QuestionnaireResponse = {
      responseId: `resp-${finalGroupId}-${finalStudentId}-${Date.now()}`,
      groupId: finalGroupId,
      studentId: finalStudentId,
      studentName: finalStudentName,
      answers: finalAnswers,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Guardar en localStorage como respaldo, pero no depender de esto
      saveResponse(response);
      console.log('Respuestas guardadas en localStorage como respaldo:', response);

      // Siempre intentar guardar en Supabase, incluso en modo local
      // Esto asegura que los datos se almacenen en la base de datos cuando se despliega desde GitHub

      // Si estamos en modo local, necesitamos obtener IDs válidos para Supabase
      if (hasLocalSession && !hasDatabaseIds) {
        console.log('Modo local con sesión: Intentando obtener IDs válidos para Supabase...');

        try {
          // Intentar obtener el ID del grupo basado en el nombre del grado
          const { data: grupoData, error: grupoError } = await supabase
            .from('grupos')
            .select('id')
            .eq('nombre', studentSession.grado)
            .eq('institucion_id', '8a9ab6bb-4f0e-4eb9-905d-f16049464305')
            .single();

          if (grupoError || !grupoData) {
            console.error('Error obteniendo ID del grupo:', grupoError);
            throw new Error(`No se pudo obtener el ID del grupo para ${studentSession.grado}`);
          }

          // Usar el ID del grupo obtenido
          const validGroupId = grupoData.id;
          console.log('ID del grupo obtenido:', validGroupId);

          // Intentar obtener o crear el estudiante en Supabase
          const nombreCompleto = studentSession.name.split(' ');
          const nombre = nombreCompleto[0];
          const apellido = nombreCompleto.slice(1).join(' ');

          // Verificar si el estudiante ya existe
          const { data: estudianteExistente, error: errorBusqueda } = await supabase
            .from('estudiantes')
            .select('id')
            .eq('numero_documento', studentSession.documento)
            .single();

          let validStudentId;

          if (estudianteExistente) {
            // Usar el ID del estudiante existente
            validStudentId = estudianteExistente.id;
            console.log('Estudiante existente encontrado:', validStudentId);
          } else {
            // Crear un nuevo estudiante
            const nuevoEstudiante = {
              nombre_estudiante: nombre,
              apellido_estudiante: apellido,
              numero_documento: studentSession.documento,
              edad: studentSession.edad || null,
              grado: studentSession.grado,
              grupo_id: validGroupId,
              institucion_id: '8a9ab6bb-4f0e-4eb9-905d-f16049464305'
            };

            const { data: estudianteCreado, error: errorCreacion } = await supabase
              .from('estudiantes')
              .insert([nuevoEstudiante])
              .select()
              .single();

            if (errorCreacion || !estudianteCreado) {
              console.error('Error creando estudiante:', errorCreacion);
              throw new Error('No se pudo crear el estudiante en Supabase');
            }

            validStudentId = estudianteCreado.id;
            console.log('Nuevo estudiante creado:', validStudentId);
          }

          // Actualizar las variables locales con los IDs válidos obtenidos
          finalStudentId = validStudentId;
          finalGroupId = validGroupId;
          
          console.log('IDs actualizados para Supabase:', {
            finalStudentId,
            finalGroupId
          });

        } catch (error) {
          console.error('Error preparando datos para Supabase:', error);
          // Si hay un error al obtener IDs válidos, mostrar mensaje y continuar
          setError(`No se pudieron guardar las respuestas en la base de datos: ${error.message}. 
                   Sin embargo, se han guardado localmente como respaldo.`);
          setTimeout(() => {
            navigate('/student/complete');
          }, 3000);
          return;
        }
      }

      // Preparar respuestas para guardar en Supabase
      const supabaseResponses = finalAnswers.map(answer => {
        // Convertir el ID local (q1, q2, etc.) a UUID real de la base de datos
        let realQuestionId;
        try {
          realQuestionId = getQuestionUuid(answer.questionId);
          console.log(`ID local ${answer.questionId} mapeado a UUID ${realQuestionId}`);

          // Verificar que el UUID tenga el formato correcto
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(realQuestionId)) {
            console.error(`UUID con formato incorrecto: ${realQuestionId}`);
            // Intentar corregir el formato
            realQuestionId = realQuestionId.toLowerCase();
            console.log(`UUID corregido: ${realQuestionId}`);
          }
        } catch (error) {
          console.error(`Error al obtener UUID para la pregunta ${answer.questionId}:`, error);
          throw new Error(`No se pudo obtener el UUID para la pregunta ${answer.questionId}`);
        }

        // No intentamos obtener el UUID de la opción, ya que no existen en la base de datos
        // Simplemente guardamos el texto de la respuesta en respuesta_texto
        let optionId = null;
        // Dejamos este código comentado por si en el futuro se configuran las opciones en la base de datos
        /*
        const question = questionnaireQuestions.find(q => q.id === answer.questionId);

        if (question?.type === 'single_choice' &&
            typeof answer.value === 'string' &&
            optionsMap[realQuestionId]) {
          // Buscar el UUID de la opción por su texto
          optionId = optionsMap[realQuestionId][answer.value] || null;
          console.log(`Opción encontrada para ${answer.value}:`, optionId);
        }
        */

        return {
          estudiante_id: finalStudentId,
          grupo_id: finalGroupId, // Añadir el ID del grupo (campo obligatorio)
          pregunta_id: realQuestionId, // Usar el UUID real en lugar del ID local
          // Si el valor es un array o un objeto, lo guardamos como texto JSON
          respuesta_texto: typeof answer.value === 'object' ? JSON.stringify(answer.value) : String(answer.value),
          // Usar el UUID de la opción si lo encontramos
          opcion_respuesta_id: optionId,
          fecha_respuesta: new Date().toISOString(),
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        };
      });

      console.log('Intentando guardar respuestas en Supabase:', supabaseResponses);

      // Verificar que los IDs finales sean válidos
      console.log('Verificando IDs antes de guardar respuestas:');
      console.log('finalStudentId:', finalStudentId);
      console.log('finalGroupId:', finalGroupId);

      if (!finalStudentId) {
        console.error('Error: ID de estudiante no válido');
        throw new Error('ID de estudiante no válido');
      }
      if (!finalGroupId) {
        console.error('Error: ID de grupo no válido');
        throw new Error('ID de grupo no válido');
      }

      // Verificar que los IDs sean UUIDs válidos (solo si no son strings de grado como "6B", "8A")
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      // Para finalStudentId, siempre debe ser un UUID
      if (!uuidRegex.test(finalStudentId)) {
        console.error('Error: finalStudentId no es un UUID válido:', finalStudentId);
        throw new Error(`ID de estudiante no es un UUID válido: ${finalStudentId}`);
      }
      
      // Para finalGroupId, puede ser un UUID o un string de grado si estamos en modo local
      if (hasLocalSession) {
        // En modo local, finalGroupId puede ser el nombre del grado, no un UUID
        console.log('Modo local: finalGroupId puede ser nombre de grado:', finalGroupId);
      } else if (!uuidRegex.test(finalGroupId)) {
        console.error('Error: finalGroupId no es un UUID válido:', finalGroupId);
        throw new Error(`ID de grupo no es un UUID válido: ${finalGroupId}`);
      }

      // Verificar que las preguntas existan
      for (const response of supabaseResponses) {
        console.log(`Verificando pregunta_id: ${response.pregunta_id}`);

        // Verificar que el ID de la pregunta sea un UUID válido
        if (!response.pregunta_id || response.pregunta_id.includes('undefined')) {
          throw new Error(`ID de pregunta no válido: ${response.pregunta_id}`);
        }

        // Verificar que el ID de la pregunta tenga el formato correcto
        // Los UUIDs deben tener el formato 00000000-0000-0000-0000-000000000001
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(response.pregunta_id)) {
          console.error(`ID de pregunta con formato incorrecto: ${response.pregunta_id}`);

          // Intentar corregir el formato si es posible
          if (response.pregunta_id.length === 36 && response.pregunta_id.split('-').length === 5) {
            // El ID tiene la longitud correcta y el número correcto de guiones, pero puede tener problemas de formato
            const correctedId = response.pregunta_id.toLowerCase();
            console.log(`Corrigiendo formato de ID: ${response.pregunta_id} -> ${correctedId}`);
            response.pregunta_id = correctedId;
          } else {
            throw new Error(`ID de pregunta con formato incorrecto: ${response.pregunta_id}`);
          }
        }
      }

      // Guardar todas las respuestas en Supabase
      let savedResponses;
      try {
        const responsesToSave = supabaseResponses.map(response => ({
          estudiante_id: response.estudiante_id,
          grupo_id: response.grupo_id, // Añadir el ID del grupo (campo obligatorio)
          pregunta_id: response.pregunta_id,
          respuesta_texto: response.respuesta_texto,
          opcion_respuesta_id: response.opcion_respuesta_id,
          fecha_respuesta: response.fecha_respuesta,
          fecha_creacion: response.fecha_creacion,
          fecha_actualizacion: response.fecha_actualizacion
        }));

        console.log('Datos a enviar a saveMultipleResponses:', JSON.stringify(responsesToSave, null, 2));
        savedResponses = await responsesApi.saveMultipleResponses(responsesToSave);
        console.log('Respuestas guardadas exitosamente:', savedResponses);
      } catch (saveError) {
        console.error('Error al guardar respuestas en Supabase:', saveError);
        throw saveError;
      }

      if (!savedResponses || savedResponses.length === 0) {
        throw new Error('No se pudieron guardar las respuestas en la base de datos');
      }

      console.log('Respuestas guardadas en localStorage y Supabase:', response);
      navigate('/student/complete');
    } catch (err: any) {
      console.error("Error guardando la respuesta:", err);
      // Mostrar un mensaje de error más específico si está disponible
      const errorMessage = err.message || "Ocurrió un error al guardar tus respuestas. Inténtalo de nuevo.";
      setError(errorMessage);
    }
  };

  // Función para determinar qué preguntas han sido respondidas
  const getAnsweredQuestions = (): Set<number> => {
    const answeredSet = new Set<number>();

    questionnaireQuestions.forEach((question, index) => {
      const answer = answers[question.id];

      if (answer === undefined || answer === null) return;

      switch (question.type) {
        case 'single_choice':
          if (typeof answer === 'string' && answer.trim() !== '') {
            answeredSet.add(index);
          }
          break;
        case 'peer_selector':
          // Para peer selector, cualquier respuesta (incluso array vacío) es válida
          if (isPeerSelectorAnswer(answer)) {
            answeredSet.add(index);
          }
          break;
        case 'checkbox_group_with_other':
          if (isCheckboxWithOtherAnswer(answer)) {
            if ((Array.isArray(answer.selected) && answer.selected.length > 0) ||
              (typeof answer.other === 'string' && answer.other.trim() !== '')) {
              answeredSet.add(index);
            }
          }
          break;
      }
    });

    return answeredSet;
  };

  // Función para navegar a una pregunta específica
  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  // --- Renderizado ---
  if (loading) {
    return <div className="p-6 text-center">Cargando datos...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>;
  }

  const isLastQuestion = currentQuestionIndex === questionnaireQuestions.length - 1;
  const questionAnswered = isCurrentQuestionAnswered();
  const answeredQuestions = getAnsweredQuestions();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navegación lateral */}
          <div className="lg:col-span-1">
            <QuestionnaireNavigation
              totalQuestions={questionnaireQuestions.length}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={answeredQuestions}
              onQuestionClick={handleQuestionNavigation}
              className="sticky top-4"
            />
          </div>

          {/* Contenido principal del cuestionario */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-1 text-gray-700">Cuestionario para {studentName}</h2>
              <p className="text-sm text-gray-500 mb-4">Grupo: {groupName || 'Cargando...'}</p>

              {/* Progress Bar */}
              <div className="mb-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questionnaireQuestions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 mb-6">
                Pregunta {currentQuestionIndex + 1} de {questionnaireQuestions.length}
              </p>

              {/* --- Renderizado de la Pregunta Actual --- */}
              <div className="border-t pt-6 min-h-[400px]">
                <label className="block text-lg font-medium text-gray-800 mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.text}
                </label>

                {/* Render component based on type */}
                {currentQuestion.type === 'single_choice' && currentQuestion.options && Array.isArray(currentQuestion.options) && (
                  <div className="space-y-3">
                    {(currentQuestion.options as string[]).map((option) => (
                      <label key={option} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'peer_selector' && (
                  <PeerSelector
                    questionId={currentQuestion.id}
                    options={currentClassmates}
                    value={isPeerSelectorAnswer(answers[currentQuestion.id])
                      ? answers[currentQuestion.id] as PeerSelectorAnswer
                      : []}
                    onChange={handleAnswerChange}
                    maxSelections={currentQuestion.maxSelections ?? 3}
                    requireExact={(() => {
                      const questionNumber = parseInt(currentQuestion.id.replace('q', ''));
                      return questionNumber >= 1 && questionNumber <= 10;
                    })()}
                  />
                )}

                {currentQuestion.type === 'checkbox_group_with_other' && currentQuestion.options && Array.isArray(currentQuestion.options) && (
                  <CheckboxGroupWithOther
                    questionId={currentQuestion.id}
                    options={currentQuestion.options as string[]}
                    value={isCheckboxWithOtherAnswer(answers[currentQuestion.id])
                      ? answers[currentQuestion.id] as CheckboxWithOtherAnswer
                      : { selected: [], other: '' }}
                    onChange={handleAnswerChange}
                  />
                )}
              </div>

              {/* --- Botones de Navegación --- */}
              <div className="mt-8 flex justify-between items-center border-t pt-6">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition duration-200"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Anterior
                </button>

                {!isLastQuestion ? (
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestion.type !== 'peer_selector' && !questionAnswered}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition duration-200"
                  >
                    Siguiente
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!questionAnswered && currentQuestion.type !== 'peer_selector'}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition duration-200"
                  >
                    Finalizar Cuestionario
                    <Send className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;