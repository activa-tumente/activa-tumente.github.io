/**
 * ARCHIVO DE COMPATIBILIDAD
 *
 * Este archivo existe solo para mantener la compatibilidad con el código existente.
 * Por favor, use directamente 'supabaseClient.ts' para nuevas implementaciones.
 */

// Importar desde el archivo principal
import { supabase, handleSupabaseError } from './supabaseClient';

// Re-exportar para mantener compatibilidad
export { supabase, handleSupabaseError };