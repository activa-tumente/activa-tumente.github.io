import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type Group = Database['public']['Tables']['grupos']['Row'];

// Extender el tipo InsertGroup para incluir los campos grado y año_escolar
type InsertGroup = Database['public']['Tables']['grupos']['Insert'] & {
  grado?: string;
  año_escolar?: string;
};

// Extender el tipo UpdateGroup para incluir los campos grado y año_escolar
type UpdateGroup = Database['public']['Tables']['grupos']['Update'] & {
  grado?: string;
  año_escolar?: string;
};

export const groupsApi = {
  // Create a new group
  create: async (group: InsertGroup): Promise<Group> => {
    const { data, error } = await supabase
      .from('grupos')
      .insert(group)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get all groups for an institution
  getByInstitution: async (institutionId: string): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .eq('institucion_id', institutionId)
      .order('nombre');

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get a single group by ID
  getById: async (id: string): Promise<Group | null> => {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      return handleSupabaseError(error);
    }
    return data;
  },

  // Update a group
  update: async (id: string, updates: UpdateGroup): Promise<Group> => {
    const { data, error } = await supabase
      .from('grupos')
      .update({ ...updates, fecha_actualizacion: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Delete a group
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('grupos')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
  }
};