/**
 * Convierte un texto en un slug URL-friendly
 * @param text Texto a convertir en slug
 * @returns Slug generado
 */
export const createSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')                   // Normalizar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Eliminar diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')               // Reemplazar espacios con guiones
    .replace(/[^\w-]+/g, '')            // Eliminar caracteres no alfanuméricos
    .replace(/--+/g, '-')               // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, '')                 // Eliminar guiones del inicio
    .replace(/-+$/, '');                // Eliminar guiones del final
};

/**
 * Genera un slug único para un grupo basado en su nombre e ID
 * @param groupName Nombre del grupo
 * @param groupId ID del grupo
 * @returns Slug único para el grupo
 */
export const createGroupSlug = (groupName: string, groupId: string): string => {
  // Crear un slug base a partir del nombre del grupo
  const baseSlug = createSlug(groupName);
  
  // Tomar los primeros 8 caracteres del ID para hacer el slug único pero no demasiado largo
  const shortId = groupId.substring(0, 8);
  
  return `${baseSlug}-${shortId}`;
};

/**
 * Extrae el ID del grupo a partir de un slug
 * @param slug Slug que contiene el ID del grupo
 * @returns ID del grupo extraído del slug
 */
export const extractGroupIdFromSlug = (slug: string): string | null => {
  // El ID está en los últimos 8 caracteres después del último guión
  const parts = slug.split('-');
  if (parts.length < 2) return null;
  
  const shortId = parts[parts.length - 1];
  
  // Buscar el ID completo en la base de datos usando el shortId
  // Esto requeriría una llamada a la base de datos
  // Por ahora, simplemente devolvemos el shortId para demostración
  return shortId;
};
