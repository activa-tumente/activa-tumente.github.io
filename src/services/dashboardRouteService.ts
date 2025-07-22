import { supabase } from '../lib/supabaseClient';
import { createGroupSlug } from '../utils/slugUtils';

/**
 * Servicio para manejar las rutas de los dashboards
 */
export const dashboardRouteService = {
  /**
   * Genera una ruta amigable para un dashboard específico
   * @param groupId ID del grupo
   * @param dashboardType Tipo de dashboard (general, bullying, academico, social)
   * @returns Promesa que resuelve a la ruta amigable
   */
  async generateFriendlyRoute(groupId: string, dashboardType: string): Promise<string> {
    try {
      // Obtener datos del grupo
      const { data: groupData, error: groupError } = await supabase
        .from('grupos')
        .select('nombre, institucion_id, instituciones_educativas(nombre)')
        .eq('id', groupId)
        .single();

      if (groupError || !groupData) {
        console.error('Error al obtener datos del grupo:', groupError);
        // Fallback a la ruta con UUID si hay error
        return `/admin/grupo/${groupId}/${dashboardType}`;
      }

      // Crear slug para el grupo
      const groupSlug = createGroupSlug(groupData.nombre, groupId);
      
      // Crear slug para la institución si está disponible
      let institutionSlug = 'institucion';
      if (groupData.instituciones_educativas?.nombre) {
        institutionSlug = createGroupSlug(groupData.instituciones_educativas.nombre, groupData.institucion_id);
      }

      // Construir la ruta amigable
      return `/admin/dashboard/${institutionSlug}/${groupSlug}/${dashboardType}`;
    } catch (error) {
      console.error('Error al generar ruta amigable:', error);
      // Fallback a la ruta con UUID si hay error
      return `/admin/grupo/${groupId}/${dashboardType}`;
    }
  },

  /**
   * Obtiene el ID del grupo a partir de una ruta amigable
   * @param institutionSlug Slug de la institución
   * @param groupSlug Slug del grupo
   * @returns Promesa que resuelve al ID del grupo
   */
  async getGroupIdFromFriendlyRoute(institutionSlug: string, groupSlug: string): Promise<string | null> {
    try {
      // Extraer el shortId del slug del grupo
      const parts = groupSlug.split('-');
      if (parts.length < 2) return null;
      
      const shortId = parts[parts.length - 1];
      
      // Buscar el grupo que coincida con el shortId
      const { data: groups, error: groupsError } = await supabase
        .from('grupos')
        .select('id')
        .ilike('id', `${shortId}%`);

      if (groupsError || !groups || groups.length === 0) {
        console.error('Error al buscar grupo por shortId:', groupsError);
        return null;
      }

      // Si hay múltiples coincidencias, tomar la primera
      return groups[0].id;
    } catch (error) {
      console.error('Error al obtener ID del grupo desde ruta amigable:', error);
      return null;
    }
  }
};
