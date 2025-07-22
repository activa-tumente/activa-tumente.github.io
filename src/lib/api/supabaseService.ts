import { supabase, handleSupabaseError } from '../supabase';
// Remove unused import
import type { QuestionnaireResponse, Student, Group, Institution } from '../../types/data';

// Institution Operations
export const getInstitutions = async (): Promise<Institution[]> => {
  try {
    const { data, error } = await supabase
      .from('instituciones_educativas')
      .select('*');

    if (error) handleSupabaseError(error);
    return data || [];
  } catch (error) {
    console.error('Error fetching institutions:', error);
    throw error;
  }
};

export const getInstitutionById = async (institutionId: string): Promise<Institution | null> => {
  try {
    const { data, error } = await supabase
      .from('instituciones_educativas')
      .select('*')
      .eq('id', institutionId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error(`Error fetching institution ${institutionId}:`, error);
    throw error;
  }
};

// Group Operations
export const getGroupsByInstitutionId = async (institutionId: string): Promise<Group[]> => {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .eq('institucion_id', institutionId);

    if (error) handleSupabaseError(error);
    return data || [];
  } catch (error) {
    console.error(`Error fetching groups for institution ${institutionId}:`, error);
    throw error;
  }
};

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
};

// Student Operations
export const getStudentsByGroupId = async (groupId: string): Promise<Student[]> => {
  try {
    // Usar la tabla de unión estudiantes_grupos para obtener los estudiantes de un grupo
    const { data, error } = await supabase
incida o      .from('estudiantes')
      .select('*, estudiantes_grupos!inner(*)')
      .eq('estudiantes_grupos.grupo_id', groupId);

    if (error) handleSupabaseError(error);
    return data || [];
  } catch (error) {
    console.error(`Error fetching students for group ${groupId}:`, error);
    throw error;
  }
};

export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error(`Error fetching student ${studentId}:`, error);
    throw error;
  }
};

// Questionnaire Response Operations
export const saveQuestionnaireResponse = async (response: QuestionnaireResponse): Promise<void> => {
  try {
    // Verificar que el estudiante pertenezca al grupo antes de guardar las respuestas
    const { data: estudianteGrupo, error: errorEstudianteGrupo } = await supabase
      .from('estudiantes_grupos')
      .select('*')
      .eq('estudiante_id', response.studentId)
      .eq('grupo_id', response.groupId)
      .single();

    if (errorEstudianteGrupo && errorEstudianteGrupo.code !== 'PGRST116') {
      // PGRST116 es el código para 'no se encontró ningún registro'
      handleSupabaseError(errorEstudianteGrupo);
      throw new Error(`El estudiante ${response.studentId} no pertenece al grupo ${response.groupId}`);
    }

    // Si el estudiante no pertenece al grupo, lanzamos un error
    if (!estudianteGrupo) {
      throw new Error(`El estudiante ${response.studentId} no pertenece al grupo ${response.groupId}`);
    }

    // Convertir la estructura de respuesta a múltiples registros en la tabla respuestas
    const respuestasToInsert = response.answers.map(answer => ({
      estudiante_id: response.studentId,
      grupo_id: response.groupId, // Añadir el ID del grupo (campo obligatorio)
      pregunta_id: answer.questionId,
      respuesta_texto: typeof answer.value === 'object' ? JSON.stringify(answer.value) : String(answer.value),
      opcion_respuesta_id: typeof answer.value === 'string' && !answer.value.startsWith('{') ? answer.value : null,
      fecha_respuesta: response.submittedAt,
      fecha_creacion: response.submittedAt,
      fecha_actualizacion: response.submittedAt
    }));

    const { error } = await supabase
      .from('respuestas')
      .insert(respuestasToInsert);

    if (error) handleSupabaseError(error);
  } catch (error) {
    console.error('Error saving questionnaire response:', error);
    throw error;
  }
};

export const getQuestionnaireResponse = async (groupId: string, studentId: string): Promise<QuestionnaireResponse | null> => {
  try {
    // Como no existe el campo grupo_id en la tabla respuestas, solo filtramos por estudiante_id
    // Primero verificamos si el estudiante pertenece al grupo especificado
    const { data: estudianteGrupo, error: errorEstudianteGrupo } = await supabase
      .from('estudiantes_grupos')
      .select('*')
      .eq('estudiante_id', studentId)
      .eq('grupo_id', groupId)
      .single();

    if (errorEstudianteGrupo && errorEstudianteGrupo.code !== 'PGRST116') {
      // PGRST116 es el código para 'no se encontró ningún registro'
      handleSupabaseError(errorEstudianteGrupo);
      return null;
    }

    // Si el estudiante no pertenece al grupo, retornamos null
    if (!estudianteGrupo) {
      return null;
    }

    // Obtenemos las respuestas del estudiante
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('estudiante_id', studentId);

    if (error) handleSupabaseError(error);

    // Transformar los datos para que coincidan con la estructura QuestionnaireResponse
    if (data && data.length > 0) {
      // Crear un objeto QuestionnaireResponse a partir de las respuestas individuales
      const answers = data.map(item => ({
        questionId: item.pregunta_id,
        value: item.respuesta_texto ?
          (item.respuesta_texto.startsWith('{') ? JSON.parse(item.respuesta_texto) : item.respuesta_texto) :
          item.opcion_respuesta_id
      }));

      return {
        responseId: `resp-${groupId}-${studentId}`,
        groupId,
        studentId,
        studentName: '', // Este dato no está disponible en la tabla respuestas
        answers,
        submittedAt: data[0].fecha_respuesta
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching response for student ${studentId}:`, error);
    throw error;
  }
};