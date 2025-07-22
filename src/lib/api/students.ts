import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type Student = Database['public']['Tables']['estudiantes']['Row'];
type InsertStudent = Database['public']['Tables']['estudiantes']['Insert'];
type UpdateStudent = Database['public']['Tables']['estudiantes']['Update'];

export const studentsApi = {
  // Create a new student
  create: async (student: InsertStudent): Promise<Student> => {
    const { data, error } = await supabase
      .from('estudiantes')
      .insert(student)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get all students for an institution
  getByInstitution: async (institutionId: string): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('institucion_id', institutionId)
      .order('nombre_estudiante');

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Get all students for a group
  getByGroup: async (groupId: string): Promise<Student[]> => {
    try {
      console.log(`[studentsApi] Fetching students for group ID: ${groupId}`);

      // Primero intentamos buscar por ID del grupo directamente
      let { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('grado', groupId)
        .order('nombre_estudiante');

      // Manejar error 406 específicamente
      if (error && error.message && error.message.includes('406')) {
        console.error('[studentsApi] 406 Not Acceptable error in getByGroup:', error.message);
        // Intentar una consulta alternativa
        const altResponse = await supabase
          .from('estudiantes')
          .select();

        if (!altResponse.error && altResponse.data) {
          // Filtrar manualmente los resultados
          data = altResponse.data.filter(student => student.grado === groupId);
          error = null;
          console.log(`[studentsApi] Alternative query succeeded, found ${data.length} students`);
        } else {
          console.error('[studentsApi] Alternative query also failed:', altResponse.error);
        }
      }

      // Si no hay resultados o hubo un error que no es 406, intentamos buscar por nombre del grupo
      if ((!error && (!data || data.length === 0)) || (error && !error.message?.includes('406'))) {
        console.log('[studentsApi] No students found by group ID, trying by group name');
        // Obtenemos el grupo para conocer su nombre
        const groupResponse = await supabase
          .from('grupos')
          .select('nombre')
          .eq('id', groupId);

        if (!groupResponse.error && groupResponse.data && groupResponse.data.length > 0) {
          const group = groupResponse.data[0];
          console.log(`[studentsApi] Found group name: ${group.nombre}, searching students by this name`);

          // Ahora buscamos estudiantes que tengan ese nombre de grupo en el campo 'grado'
          const response = await supabase
            .from('estudiantes')
            .select('*')
            .eq('grado', group.nombre)
            .order('nombre_estudiante');

          data = response.data || [];
          error = response.error;

          if (error) {
            console.error('[studentsApi] Error fetching students by group name:', error);
          } else {
            console.log(`[studentsApi] Found ${data.length} students by group name`);
          }
        } else {
          console.error('[studentsApi] Error or no data when fetching group:', groupResponse.error);
        }
      }

      if (error) {
        console.error('[studentsApi] Final error in getByGroup:', error);
        return handleSupabaseError(error);
      }

      console.log(`[studentsApi] Successfully fetched ${data?.length || 0} students for group ${groupId}`);
      return data || [];
    } catch (err) {
      console.error('[studentsApi] Unexpected error in getByGroup:', err);
      throw err;
    }
  },

  // Get a single student by ID
  getById: async (id: string): Promise<Student | null> => {
    try {
      console.log(`[studentsApi] Fetching student with ID: ${id}`);

      const { data, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`[studentsApi] Error fetching student with ID ${id}:`, error);
        if (error.code === 'PGRST116') {
          console.warn(`[studentsApi] Student with ID ${id} not found`);
          return null; // Record not found
        }
        if (error.message && error.message.includes('406')) {
          console.error('[studentsApi] 406 Not Acceptable error - Headers issue:', error.message);
          // Intentar una consulta alternativa sin usar .single()
          const { data: altData, error: altError } = await supabase
            .from('estudiantes')
            .select('*')
            .eq('id', id);

          if (altError) {
            console.error('[studentsApi] Alternative query also failed:', altError);
            return handleSupabaseError(altError);
          }

          if (altData && altData.length > 0) {
            console.log('[studentsApi] Alternative query succeeded:', altData[0]);
            return altData[0];
          }

          return null;
        }
        return handleSupabaseError(error);
      }
      return data;
    } catch (err) {
      console.error('[studentsApi] Unexpected error in getById:', err);
      throw err;
    }
  },

  // Get a student by their anonymous code
  getByCode: async (code: string): Promise<Student | null> => {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('nombre_estudiante', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      return handleSupabaseError(error);
    }
    return data;
  },

  // Update a student
  update: async (id: string, updates: UpdateStudent): Promise<Student> => {
    const { data, error } = await supabase
      .from('estudiantes')
      .update({ ...updates, fecha_actualizacion: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);
    return data;
  },

  // Delete a student
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('estudiantes')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);
  }
};