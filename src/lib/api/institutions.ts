import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type Institution = Database['public']['Tables']['instituciones_educativas']['Row'];
type InsertInstitution = Database['public']['Tables']['instituciones_educativas']['Insert'];
type UpdateInstitution = Database['public']['Tables']['instituciones_educativas']['Update'];

export const institutionsApi = {
  // Create a new institution
  create: async (institution: InsertInstitution): Promise<Institution> => {
    try {
      const { data, error } = await supabase
        .from('instituciones_educativas')
        .insert(institution)
        .select()
        .single();

      if (error) throw handleSupabaseError(error);
      if (!data) throw new Error('No se pudo crear la institución');
      return data;
    } catch (err) {
      console.error('Error al crear institución:', err);
      throw err;
    }
  },

  // Get all institutions
  getAll: async (): Promise<Institution[]> => {
    const { data, error } = await supabase
      .from('instituciones_educativas')
      .select('*')
      .order('nombre');

    if (error) throw handleSupabaseError(error);
    return data || [];
  },

  // Get a single institution by ID
  getById: async (id: string): Promise<Institution | null> => {
    const { data, error } = await supabase
      .from('instituciones_educativas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw handleSupabaseError(error);
    }
    return data;
  },

  // Update an institution
  update: async (id: string, updates: UpdateInstitution): Promise<Institution> => {
    const { data, error } = await supabase
      .from('instituciones_educativas')
      .update({ ...updates, fecha_actualizacion: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    if (!data) throw new Error('No se pudo actualizar la institución');
    return data;
  },

  // Delete an institution
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('instituciones_educativas')
      .delete()
      .eq('id', id);

    if (error) throw handleSupabaseError(error);
  }
};