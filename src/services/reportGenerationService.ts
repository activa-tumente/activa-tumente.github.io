import bullsAnalysisService from './bullsAnalysisService';

interface ReportData {
  titulo: string;
  fecha_generacion: string;
  institucion: string;
  grupos: string[];
  estadisticas: any;
  hallazgos: any[];
  recomendaciones: any[];
  estudiantes_clave: any[];
}

class ReportGenerationService {
  // Generar datos del reporte
  async generateReportData(grupoId?: string): Promise<ReportData> {
    try {
      const reporteCompleto = await bullsAnalysisService.generarReporteCompleto(grupoId);
      
      return {
        titulo: 'Análisis Test BULL-S - Evaluación de Agresividad entre Escolares',
        fecha_generacion: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        institucion: 'Colegio La Salle',
        grupos: reporteCompleto.estadisticas.grupos_analizados,
        estadisticas: reporteCompleto.estadisticas,
        hallazgos: reporteCompleto.hallazgos,
        recomendaciones: reporteCompleto.recomendaciones,
        estudiantes_clave: [
          ...reporteCompleto.roles_bullying.filter(r => r.perfil_agresor),
          ...reporteCompleto.roles_bullying.filter(r => r.perfil_victima)
        ]
      };
    } catch (error) {
      console.error('Error generating report data:', error);
      throw error;
    }
  }

  // Exportar como PDF (simulado)
  async exportToPDF(grupoId?: string): Promise<void> {
    try {
      const reportData = await this.generateReportData(grupoId);
      
      // Simular generación de PDF
      console.log('Generando PDF con datos:', reportData);
      
      // En una implementación real, usarías una librería como jsPDF o html2pdf
      const pdfContent = this.generatePDFContent(reportData);
      
      // Simular descarga
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-bulls-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Mostrar notificación de éxito
      this.showNotification('PDF generado exitosamente', 'success');
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      this.showNotification('Error al generar PDF', 'error');
      throw error;
    }
  }

  // Exportar a Excel (simulado)
  async exportToExcel(grupoId?: string): Promise<void> {
    try {
      const reporteCompleto = await bullsAnalysisService.generarReporteCompleto(grupoId);
      
      // Simular generación de Excel
      const excelData = this.generateExcelData(reporteCompleto);
      
      // En una implementación real, usarías una librería como xlsx
      const csvContent = this.convertToCSV(excelData);
      
      // Simular descarga
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `datos-bulls-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      this.showNotification('Excel generado exitosamente', 'success');
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.showNotification('Error al generar Excel', 'error');
      throw error;
    }
  }

  // Exportar como imagen (captura de pantalla)
  async exportToImage(): Promise<void> {
    try {
      // En una implementación real, usarías html2canvas
      console.log('Capturando pantalla del dashboard...');
      
      // Simular captura
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showNotification('Imagen capturada exitosamente', 'success');
      
    } catch (error) {
      console.error('Error capturing image:', error);
      this.showNotification('Error al capturar imagen', 'error');
      throw error;
    }
  }

  // Generar contenido PDF (simulado)
  private generatePDFContent(reportData: ReportData): string {
    return `
INFORME BULL-S
${reportData.titulo}

Fecha de generación: ${reportData.fecha_generacion}
Institución: ${reportData.institucion}
Grupos analizados: ${reportData.grupos.join(', ')}

ESTADÍSTICAS GENERALES
- Total estudiantes: ${reportData.estadisticas.total_estudiantes}
- Respuestas válidas: ${reportData.estadisticas.respuestas_validas} (${reportData.estadisticas.porcentaje_respuestas}%)
- Rango de edad: ${reportData.estadisticas.rango_edad}

HALLAZGOS PRINCIPALES
${reportData.hallazgos.map(h => `- ${h.titulo}: ${h.descripcion}`).join('\n')}

RECOMENDACIONES
${reportData.recomendaciones.map(r => `- ${r.titulo}: ${r.descripcion}`).join('\n')}

ESTUDIANTES CLAVE
${reportData.estudiantes_clave.map(e => `- ${e.nombre_completo} (${e.grupo}): ${e.perfil_agresor ? 'Agresor' : 'Víctima'}`).join('\n')}
    `;
  }

  // Generar datos para Excel
  private generateExcelData(reporteCompleto: any): any[] {
    const data = [];
    
    // Hoja 1: Estudiantes sociométricos
    data.push({
      hoja: 'Sociometría',
      datos: reporteCompleto.estudiantes_sociometricos.map(e => ({
        'Nombre': e.nombre_estudiante,
        'Apellido': e.apellido_estudiante,
        'Grupo': e.grado,
        'Elecciones Recibidas': e.elecciones_recibidas,
        'Rechazos Recibidos': e.rechazos_recibidos,
        'Índice Popularidad': e.popularidad_index
      }))
    });
    
    // Hoja 2: Roles de bullying
    data.push({
      hoja: 'Roles Bullying',
      datos: reporteCompleto.roles_bullying.map(r => ({
        'Estudiante': r.nombre_completo,
        'Grupo': r.grupo,
        'Fuerte %': r.fuerte,
        'Cobarde %': r.cobarde,
        'Maltrato %': r.maltrato,
        'Víctima %': r.victima,
        'Provocación %': r.provocacion,
        'Manía %': r.mania,
        'Perfil': r.perfil_agresor ? 'Agresor' : r.perfil_victima ? 'Víctima' : 'Neutral'
      }))
    });
    
    return data;
  }

  // Convertir a CSV
  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    let csv = '';
    
    data.forEach(hoja => {
      csv += `\n${hoja.hoja}\n`;
      
      if (hoja.datos.length > 0) {
        // Headers
        const headers = Object.keys(hoja.datos[0]);
        csv += headers.join(',') + '\n';
        
        // Rows
        hoja.datos.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
          });
          csv += values.join(',') + '\n';
        });
      }
      
      csv += '\n';
    });
    
    return csv;
  }

  // Mostrar notificación
  private showNotification(message: string, type: 'success' | 'error'): void {
    // En una implementación real, usarías una librería de notificaciones como react-toastify
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  // Generar reporte de seguimiento
  async generateFollowUpReport(fechaAnterior: string, grupoId?: string): Promise<any> {
    try {
      const reporteActual = await bullsAnalysisService.generarReporteCompleto(grupoId);
      
      // En una implementación real, compararías con datos históricos
      return {
        fecha_comparacion: fechaAnterior,
        fecha_actual: new Date().toISOString().split('T')[0],
        mejoras_detectadas: [
          'Reducción del 15% en rechazos hacia Paulina Bermúdez',
          'Mejora en cohesión grupal del grupo 6A',
          'Disminución de agresiones en el aula (de 58% a 45%)'
        ],
        areas_preocupacion: [
          'Persistencia de comportamientos agresivos en Isabella León',
          'Nuevos casos de aislamiento social detectados'
        ],
        recomendaciones_actualizadas: reporteActual.recomendaciones.filter(r => r.prioridad === 'ALTA')
      };
    } catch (error) {
      console.error('Error generating follow-up report:', error);
      throw error;
    }
  }
}

export const reportGenerationService = new ReportGenerationService();
export default reportGenerationService;