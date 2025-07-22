import { Database } from './database';

// Supabase table types
export type InstitutionRow = Database['public']['Tables']['instituciones_educativas']['Row'];
export type GroupRow = Database['public']['Tables']['grupos']['Row'];
export type StudentRow = Database['public']['Tables']['estudiantes']['Row'];
export type QuestionnaireResponseRow = Database['public']['Tables']['respuestas']['Row'];

// Supabase insert types
export type InstitutionInsert = Database['public']['Tables']['instituciones_educativas']['Insert'];
export type GroupInsert = Database['public']['Tables']['grupos']['Insert'];
export type StudentInsert = Database['public']['Tables']['estudiantes']['Insert'];
export type QuestionnaireResponseInsert = Database['public']['Tables']['respuestas']['Insert'];

// Supabase update types
export type InstitutionUpdate = Database['public']['Tables']['instituciones_educativas']['Update'];
export type GroupUpdate = Database['public']['Tables']['grupos']['Update'];
export type StudentUpdate = Database['public']['Tables']['estudiantes']['Update'];
export type QuestionnaireResponseUpdate = Database['public']['Tables']['respuestas']['Update'];

// Type guards and conversion utilities
export const isInstitutionRow = (data: any): data is InstitutionRow => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.nombre === 'string' &&
    typeof data.fecha_creacion === 'string' &&
    typeof data.fecha_actualizacion === 'string'
  );
};

export const isGroupRow = (data: any): data is GroupRow => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.nombre === 'string' &&
    typeof data.institucion_id === 'string' &&
    typeof data.fecha_creacion === 'string' &&
    typeof data.fecha_actualizacion === 'string'
  );
};

export const isStudentRow = (data: any): data is StudentRow => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.nombre_estudiante === 'string' &&
    typeof data.institucion_id === 'string' &&
    typeof data.fecha_creacion === 'string' &&
    typeof data.fecha_actualizacion === 'string'
  );
};

export const isQuestionnaireResponseRow = (data: any): data is QuestionnaireResponseRow => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.estudiante_id === 'string' &&
    typeof data.pregunta_id === 'string' &&
    typeof data.fecha_creacion === 'string'
  );
};