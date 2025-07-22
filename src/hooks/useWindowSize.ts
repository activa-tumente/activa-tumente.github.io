import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook para detectar el tamaño de la ventana y determinar el tipo de dispositivo
 */
export function useWindowSize(): WindowSize {
  // Estado para almacenar el tamaño de la ventana
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    // Función para actualizar el estado con el tamaño de la ventana
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 640,  // Breakpoint sm en Tailwind
        isTablet: width >= 640 && width < 1024, // Entre sm y lg en Tailwind
        isDesktop: width >= 1024 // Breakpoint lg en Tailwind
      });
    }

    // Añadir event listener
    window.addEventListener('resize', handleResize);
    
    // Llamar a la función directamente para establecer el tamaño inicial
    handleResize();
    
    // Limpiar event listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;
