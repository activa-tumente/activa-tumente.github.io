import { useState } from 'react';

/**
 * Hook para gestionar el estado de secciones expandibles/colapsables
 * @param initialState Objeto con el estado inicial de cada sección
 * @returns Objeto con el estado actual y función para alternar secciones
 */
export function useExpandableSections<T extends Record<string, boolean>>(initialState: T) {
  const [expandedSections, setExpandedSections] = useState<T>(initialState);

  const toggleSection = (sectionKey: keyof T) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const expandAll = () => {
    const allExpanded = Object.keys(initialState).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as T);
    
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = Object.keys(initialState).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as T);
    
    setExpandedSections(allCollapsed);
  };

  return {
    expandedSections,
    toggleSection,
    expandAll,
    collapseAll
  };
}
