import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type Questionnaire = Database['public']['Tables']['cuestionarios']['Row'];
type InsertQuestionnaire = Database['public']['Tables']['cuestionarios']['Insert'];
type UpdateQuestionnaire = Database['public']['Tables']['cuestionarios']['Update'];

export const questionnairesApi = {
  // Create a new questionnaire
  create: async (questionnaire: InsertQuestionnaire): Promise<Questionnaire> => {
    const { data, error } = await supabase
      .from('cuestionarios')
      .insert(questionnaire)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get all questionnaires
  getAll: async (): Promise<Questionnaire[]> => {
    const { data, error } = await supabase
      .from('cuestionarios')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get a single questionnaire by ID
  getById: async (id: string): Promise<Questionnaire | null> => {
    const { data, error } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      return handleSupabaseError(error);
    }
    return data;
  },

  // Get questionnaires by administration date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Questionnaire[]> => {
    const { data, error } = await supabase
      .from('cuestionarios')
      .select('*')
      .gte('fecha_administracion', startDate)
      .lte('fecha_administracion', endDate)
      .order('fecha_administracion');

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Update a questionnaire
  update: async (id: string, updates: UpdateQuestionnaire): Promise<Questionnaire> => {
    const { data, error } = await supabase
      .from('cuestionarios')
      .update({ ...updates, fecha_actualizacion: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Delete a questionnaire
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('cuestionarios')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
  }
};