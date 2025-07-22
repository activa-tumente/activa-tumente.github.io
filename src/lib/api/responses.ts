import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

// Definición de tipos para las respuestas
// La tabla en Supabase se llama 'respuestas' según el esquema
type Response = Database['public']['Tables']['respuestas']['Row'];

// Extender el tipo InsertResponse para incluir el campo grupo_id
type InsertResponse = Database['public']['Tables']['respuestas']['Insert'] & {
  grupo_id: string;
};

export const responsesApi = {
  // Guardar una respuesta individual
  saveResponse: async (response: InsertResponse): Promise<Response> => {
    const { data, error } = await supabase
      .from('respuestas')
      .insert(response)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Guardar múltiples respuestas en una sola operación
  saveMultipleResponses: async (responses: InsertResponse[]): Promise<Response[]> => {
    try {
      console.log('Intentando guardar respuestas en Supabase con los siguientes datos:', JSON.stringify(responses, null, 2));

      // Verificar que todos los campos obligatorios estén presentes
      let hasErrors = false;
      responses.forEach((response, index) => {
        if (!response.estudiante_id) {
          console.error(`Respuesta ${index}: Falta estudiante_id`);
          hasErrors = true;
        }
        if (!response.grupo_id) {
          console.error(`Respuesta ${index}: Falta grupo_id`);
          hasErrors = true;
        }
        if (!response.pregunta_id) {
          console.error(`Respuesta ${index}: Falta pregunta_id`);
          hasErrors = true;
        }

        // Verificar que los IDs sean UUIDs válidos
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (response.estudiante_id && !uuidRegex.test(response.estudiante_id)) {
          console.error(`Respuesta ${index}: estudiante_id no es un UUID válido: ${response.estudiante_id}`);
          hasErrors = true;
        }
        if (response.grupo_id && !uuidRegex.test(response.grupo_id)) {
          console.error(`Respuesta ${index}: grupo_id no es un UUID válido: ${response.grupo_id}`);
          hasErrors = true;
        }
        if (response.pregunta_id && !uuidRegex.test(response.pregunta_id)) {
          console.error(`Respuesta ${index}: pregunta_id no es un UUID válido: ${response.pregunta_id}`);
          hasErrors = true;
        }
      });

      if (hasErrors) {
        throw new Error('Hay errores en los datos de las respuestas. Revisa la consola para más detalles.');
      }

      // Intentar guardar las respuestas una por una para identificar cuál está causando problemas
      const savedResponses: Response[] = [];

      for (let i = 0; i < responses.length; i++) {
        try {
          console.log(`Intentando guardar respuesta ${i}:`, JSON.stringify(responses[i], null, 2));

          const { data, error } = await supabase
            .from('respuestas')
            .insert([responses[i]])
            .select();

          if (error) {
            console.error(`Error al guardar respuesta ${i}:`, error);
            console.error('Detalles del error:', JSON.stringify(error, null, 2));
            throw error;
          }

          if (data && data.length > 0) {
            console.log(`Respuesta ${i} guardada exitosamente:`, data[0]);
            savedResponses.push(data[0]);
          }
        } catch (err) {
          console.error(`Error al guardar respuesta ${i}:`, err);
          throw err;
        }
      }

      if (savedResponses.length === 0) {
        console.warn('No se recibieron datos después de insertar respuestas');
        throw new Error('No se pudieron guardar las respuestas');
      }

      return savedResponses;
    } catch (err) {
      console.error('Error inesperado al guardar respuestas:', err);
      throw err; // Propagar el error para que pueda ser manejado por el componente
    }
  },

  // Obtener respuestas por estudiante
  getByStudentId: async (studentId: string): Promise<Response[]> => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('estudiante_id', studentId);

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Obtener respuestas por pregunta
  getByQuestionId: async (questionId: string): Promise<Response[]> => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('pregunta_id', questionId);

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Verificar si un estudiante ha completado el cuestionario para un grupo específico
  hasStudentCompletedQuestionnaire: async (studentId: string, groupId: string): Promise<boolean> => {
    try {
      console.log(`[responsesApi] Verificando si el estudiante ${studentId} ha completado el cuestionario para el grupo ${groupId}`);

      // Consultar todas las respuestas para este estudiante en este grupo
      const { data, error } = await supabase
        .from('respuestas')
        .select('id, pregunta_id')
        .eq('estudiante_id', studentId)
        .eq('grupo_id', groupId);

      if (error) {
        console.error('[responsesApi] Error al verificar respuestas:', error);
        return handleSupabaseError(error);
      }

      // Verificar si hay respuestas
      if (!data || data.length === 0) {
        console.log(`[responsesApi] El estudiante ${studentId} no tiene respuestas para el grupo ${groupId}`);
        return false;
      }

      // Contar preguntas únicas respondidas
      const uniqueQuestions = new Set(data.map(r => r.pregunta_id));
      console.log(`[responsesApi] El estudiante ${studentId} ha respondido ${uniqueQuestions.size} preguntas únicas para el grupo ${groupId}`);

      // Si hay al menos una respuesta, consideramos que el estudiante ha completado el cuestionario
      return uniqueQuestions.size > 0;
    } catch (err) {
      console.error('[responsesApi] Error inesperado al verificar respuestas:', err);
      throw err;
    }
  }
};