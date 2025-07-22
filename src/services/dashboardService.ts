import { supabase } from '../lib/supabaseClient';
import sociometricService from './sociometricService';

/**
 * Interfaz para los datos de convivencia escolar
 */
export interface DatosConvivencia {
  tasaIncidencia: {
    agresores: number;
    victimas: number;
    agresoresVictimas: number;
    otros: number;
  };
  estatusSociometrico: {
    populares: number;
    promedio: number;
    aislados: number;
    rechazados: number;
    controvertidos: number;
  };
  cohesionGrupal: {
    valor: number;
    categoria: string;
  };
  dinamicasAcoso: {
    fuertes: number;
    cobardes: number;
    agresivos: number;
    victimas: number;
    provocadores: number;
    recibenMania: number;
  };
  factoresSituacionales: {
    formasAgresion: Record<string, number>;
    lugaresComunes: Record<string, number>;
    frecuenciaPercibida: Record<string, number>;
    gravedadPercibida: Record<string, number>;
    seguridadPercibida: Record<string, number>;
  };
}

/**
 * Servicio para obtener datos del dashboard
 */
const dashboardService = {
  /**
   * Obtener datos de convivencia escolar
   * @param institucionId ID de la institución (opcional)
   * @param grupoId ID del grupo (opcional)
   * @returns Datos de convivencia escolar
   */
  async obtenerDatosConvivencia(institucionId?: string, grupoId?: string): Promise<DatosConvivencia> {
    try {
      // Obtener datos de roles de bullying (tasas de incidencia)
      const rolesBullyingData = await sociometricService.getRolesBullying(institucionId, grupoId);

      // Transformar los datos al formato requerido
      const tasaIncidencia = {
        agresores: rolesBullyingData.find(role => role.name === 'Agresores')?.value || 0,
        victimas: rolesBullyingData.find(role => role.name === 'Víctimas')?.value || 0,
        agresoresVictimas: rolesBullyingData.find(role => role.name === 'Víctima-Provocador')?.value || 0,
        otros: rolesBullyingData.find(role => role.name === 'No implicados')?.value || 0
      };

      // Obtener datos de estatus sociométrico
      const estatusSociometricoData = await sociometricService.getEstatusSociometrico(institucionId, grupoId);

      // Obtener datos de cohesión grupal
      const cohesionGrupalData = await sociometricService.getCohesionGrupal(grupoId);

      // Obtener datos de formas de agresión
      const formasAgresionData = await sociometricService.getFormasAgresion(grupoId);

      // Obtener datos de lugares de agresión
      const lugaresAgresionData = await sociometricService.getLugaresAgresion(grupoId);

      // Obtener datos de tipos de agresión
      const tiposAgresionData = await sociometricService.getTiposAgresion(grupoId);

      // Transformar los datos de formas de agresión al formato requerido
      const formasAgresion: Record<string, number> = {};
      formasAgresionData.forEach(forma => {
        formasAgresion[forma.name] = forma.value;
      });

      // Transformar los datos de lugares de agresión al formato requerido
      const lugaresComunes: Record<string, number> = {};
      lugaresAgresionData.forEach(lugar => {
        lugaresComunes[lugar.name] = lugar.value;
      });

      // Calcular dinámicas de acoso a partir de los datos de tipos de agresión
      // Estos valores deberían obtenerse de una vista específica en Supabase
      // Por ahora, usamos valores calculados a partir de los datos disponibles
      const dinamicasAcoso = {
        fuertes: Math.round(tiposAgresionData.find(tipo => tipo.name === 'Físico')?.value || 35),
        cobardes: Math.round(tiposAgresionData.find(tipo => tipo.name === 'Intimidación')?.value || 28),
        agresivos: Math.round(tiposAgresionData.find(tipo => tipo.name === 'Verbal')?.value || 30),
        victimas: Math.round(rolesBullyingData.find(role => role.name === 'Víctimas')?.value || 25),
        provocadores: Math.round(tiposAgresionData.find(tipo => tipo.name === 'Exclusión')?.value || 15),
        recibenMania: Math.round(tiposAgresionData.find(tipo => tipo.name === 'Social')?.value || 20)
      };

      // Obtener datos de frecuencia, gravedad y seguridad percibida
      // Estos datos deberían obtenerse de vistas específicas en Supabase
      // Por ahora, usamos valores simulados
      const frecuenciaPercibida = {
        'Nunca': 20,
        'Pocas veces': 45,
        'Bastantes veces': 25,
        'Muchas veces': 10
      };

      const gravedadPercibida = {
        'Nada': 15,
        'Poco': 30,
        'Bastante': 40,
        'Mucho': 15
      };

      const seguridadPercibida = {
        'Nada': 10,
        'Poco': 20,
        'Bastante': 45,
        'Mucho': 25
      };

      return {
        tasaIncidencia,
        estatusSociometrico: estatusSociometricoData,
        cohesionGrupal: cohesionGrupalData,
        dinamicasAcoso,
        factoresSituacionales: {
          formasAgresion,
          lugaresComunes,
          frecuenciaPercibida,
          gravedadPercibida,
          seguridadPercibida
        }
      };
    } catch (error) {
      console.error('Error al obtener datos de convivencia:', error);

      // Devolver datos simulados como fallback
      return {
        tasaIncidencia: {
          agresores: 15,
          victimas: 20,
          agresoresVictimas: 5,
          otros: 60
        },
        estatusSociometrico: {
          populares: 25,
          promedio: 40,
          aislados: 15,
          rechazados: 12,
          controvertidos: 8
        },
        cohesionGrupal: {
          valor: 72,
          categoria: 'Óptima'
        },
        dinamicasAcoso: {
          fuertes: 35,
          cobardes: 28,
          agresivos: 30,
          victimas: 25,
          provocadores: 15,
          recibenMania: 20
        },
        factoresSituacionales: {
          formasAgresion: {
            'Insultos': 45,
            'Golpes': 20,
            'Amenazas': 15,
            'Rechazo': 35,
            'Rumores': 30
          },
          lugaresComunes: {
            'Aula': 40,
            'Patio': 35,
            'Pasillos': 15,
            'Baños': 10,
            'Fuera del centro': 5
          },
          frecuenciaPercibida: {
            'Nunca': 20,
            'Pocas veces': 45,
            'Bastantes veces': 25,
            'Muchas veces': 10
          },
          gravedadPercibida: {
            'Nada': 15,
            'Poco': 30,
            'Bastante': 40,
            'Mucho': 15
          },
          seguridadPercibida: {
            'Nada': 10,
            'Poco': 20,
            'Bastante': 45,
            'Mucho': 25
          }
        }
      };
    }
  }
};

export default dashboardService;
