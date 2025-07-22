import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type OptionResponse = Database['public']['Tables']['opciones_respuesta']['Row'];

export const optionsApi = {
  // Obtener todas las opciones de respuesta para una pregunta
  getByQuestionId: async (questionId: string): Promise<OptionResponse[]> => {
    const { data, error } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .eq('pregunta_id', questionId)
      .order('orden');

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Obtener todas las opciones de respuesta
  getAll: async (): Promise<OptionResponse[]> => {
    const { data, error } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .order('pregunta_id, orden');

    if (error) return handleSupabaseError(error);
    return data;
  }
};
