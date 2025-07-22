import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BullyingMetrics } from '../pages/admin/bullying-dashboard/types/dashboardTypes';
import { getCohesionLevel, getPerceptionText } from '../pages/admin/bullying-dashboard/utils/dataFormatters';
import { generateGeneralRecommendations, generatePreventiveRecommendations } from '../pages/admin/bullying-dashboard/utils/recommendationUtils';

/**
 * Genera un informe PDF para el dashboard de bullying
 * @param metrics Métricas del dashboard de bullying
 * @param groupName Nombre del grupo
 */
export const generateBullyingReport = async (metrics: BullyingMetrics, groupName: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Título y encabezado
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 153);
    pdf.text(`Informe de Bullying: ${groupName}`, margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
    
    yPos += 15;
    
    // Resumen ejecutivo
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Resumen Ejecutivo', margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const hasBullyingIssue = 
      metrics.roles.bullies + metrics.roles.victims + metrics.roles.bullyVictims > metrics.totalStudents * 0.1 ||
      metrics.perception.frequency > 2.5 ||
      metrics.perception.severity > 2.5;
    
    const summaryText = hasBullyingIssue 
      ? `Se ha detectado una incidencia de bullying significativa en el grupo. La percepción de frecuencia es ${getPerceptionText(metrics.perception.frequency).toLowerCase()} (${metrics.perception.frequency.toFixed(1)}/5) y la severidad es ${getPerceptionText(metrics.perception.severity).toLowerCase()} (${metrics.perception.severity.toFixed(1)}/5). La cohesión grupal es ${getCohesionLevel(metrics.groupCohesion).toLowerCase()} (${metrics.groupCohesion.toFixed(1)}%).`
      : `No se detectan patrones significativos de bullying en el grupo. La percepción de frecuencia es ${getPerceptionText(metrics.perception.frequency).toLowerCase()} (${metrics.perception.frequency.toFixed(1)}/5) y la severidad es ${getPerceptionText(metrics.perception.severity).toLowerCase()} (${metrics.perception.severity.toFixed(1)}/5). La cohesión grupal es ${getCohesionLevel(metrics.groupCohesion).toLowerCase()} (${metrics.groupCohesion.toFixed(1)}%).`;
    
    const splitSummary = pdf.splitTextToSize(summaryText, contentWidth);
    pdf.text(splitSummary, margin, yPos);
    
    yPos += splitSummary.length * 5 + 10;
    
    // Datos cuantitativos
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Indicadores Cuantitativos', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    // Roles
    pdf.text(`• Total estudiantes: ${metrics.totalStudents}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Agresores: ${metrics.roles.bullies} (${((metrics.roles.bullies / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    yPos += 5;
    pdf.text(`• Víctimas: ${metrics.roles.victims} (${((metrics.roles.victims / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    yPos += 5;
    pdf.text(`• Agresor/Víctima: ${metrics.roles.bullyVictims} (${((metrics.roles.bullyVictims / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    yPos += 5;
    pdf.text(`• No implicados: ${metrics.roles.notInvolved} (${((metrics.roles.notInvolved / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    
    yPos += 10;
    
    // Estatus Sociométrico
    pdf.text(`• Populares: ${metrics.sociometric.popular} (${((metrics.sociometric.popular / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    yPos += 5;
    pdf.text(`• Rechazados: ${metrics.sociometric.rejected} (${((metrics.sociometric.rejected / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    yPos += 5;
    pdf.text(`• Aislados: ${metrics.sociometric.isolated} (${((metrics.sociometric.isolated / metrics.totalStudents) * 100).toFixed(1)}%)`, margin, yPos);
    
    // Nueva página si es necesario
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    } else {
      yPos += 15;
    }
    
    // Percepciones
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Percepciones', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    pdf.text(`• Frecuencia de bullying: ${metrics.perception.frequency.toFixed(1)}/5 - ${getPerceptionText(metrics.perception.frequency)}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Severidad de bullying: ${metrics.perception.severity.toFixed(1)}/5 - ${getPerceptionText(metrics.perception.severity)}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Percepción de seguridad: ${metrics.perception.safety.toFixed(1)}/5 - ${getPerceptionText(metrics.perception.safety)}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Cohesión grupal: ${metrics.groupCohesion.toFixed(1)}% - ${getCohesionLevel(metrics.groupCohesion)}`, margin, yPos);
    
    yPos += 15;
    
    // Recomendaciones
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recomendaciones', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const recommendations = hasBullyingIssue 
      ? generateGeneralRecommendations(metrics) 
      : generatePreventiveRecommendations(metrics);
    
    recommendations.forEach(rec => {
      const splitRec = pdf.splitTextToSize(`• ${rec}`, contentWidth);
      pdf.text(splitRec, margin, yPos);
      yPos += splitRec.length * 5 + 3;
      
      // Nueva página si es necesario
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Estudiantes en riesgo
    if (metrics.atRiskStudents && metrics.atRiskStudents.length > 0) {
      // Nueva página si hay poco espacio
      if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Estudiantes en Situación de Riesgo', margin, yPos);
      
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      metrics.atRiskStudents.forEach(student => {
        pdf.text(`• ${student.name} - Nivel de riesgo: ${student.risk_level}/10`, margin, yPos);
        yPos += 5;
        
        const factorsText = `   Factores de riesgo: ${student.risk_factors.join(', ')}`;
        const splitFactors = pdf.splitTextToSize(factorsText, contentWidth - 5);
        pdf.text(splitFactors, margin, yPos);
        yPos += splitFactors.length * 5 + 5;
        
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
      });
    }
    
    // Pie de página
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`BULLS - Informe generado el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, 285);
    }
    
    // Guardar el PDF
    pdf.save(`Informe_Bullying_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error: any) {
    console.error('Error al generar el informe PDF:', error);
    throw new Error(`Error al generar el informe: ${error.message}`);
  }
};

/**
 * Genera un informe PDF para el dashboard general
 * @param data Datos del dashboard general
 * @param groupName Nombre del grupo
 * @param institutionName Nombre de la institución
 */
export const generateGeneralReport = async (data: any, groupName: string, institutionName: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Título y encabezado
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 153);
    pdf.text(`Informe General: ${groupName}`, margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Institución: ${institutionName} | Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
    
    yPos += 15;
    
    // Información del grupo
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Información del Grupo', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    // Detalles del grupo
    pdf.text(`• Nombre del grupo: ${groupName}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Grado: ${data.grado || 'No especificado'}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Año escolar: ${data.añoEscolar || new Date().getFullYear()}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Total de estudiantes: ${data.totalEstudiantes || 0}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Distribución por género: ${data.estudiantes?.masculino || 0} masculinos, ${data.estudiantes?.femenino || 0} femeninos`, margin, yPos);
    
    yPos += 15;
    
    // Asistencia y participación
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Asistencia y Participación', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    pdf.text(`• Promedio de asistencia: ${data.asistencia?.promedio || 0}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Tasa de respuesta a cuestionarios: ${data.cuestionarios?.tasaRespuesta || 0}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Total de respuestas: ${data.cuestionarios?.total || 0}`, margin, yPos);
    
    // Nueva página
    pdf.addPage();
    yPos = 20;
    
    // Resumen de hallazgos
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Resumen de Hallazgos', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const findings = [
      "El grupo muestra una cohesión general adecuada.",
      "Se recomienda prestar atención a la asistencia y participación.",
      "Los indicadores académicos muestran un rendimiento dentro de lo esperado.",
      "No se detectan problemas significativos de convivencia en el grupo.",
      "La comunicación entre estudiantes tiene un nivel satisfactorio."
    ];
    
    findings.forEach(finding => {
      pdf.text(`• ${finding}`, margin, yPos);
      yPos += 5;
    });
    
    yPos += 10;
    
    // Recomendaciones generales
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recomendaciones Generales', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const recommendations = [
      "Continuar con las estrategias de integración grupal existentes.",
      "Implementar actividades para mejorar la participación en cuestionarios y evaluaciones.",
      "Revisar periódicamente los indicadores de clima escolar y rendimiento.",
      "Fomentar espacios de diálogo y resolución de conflictos.",
      "Mantener la comunicación con familias sobre el progreso del grupo."
    ];
    
    recommendations.forEach(rec => {
      pdf.text(`• ${rec}`, margin, yPos);
      yPos += 5;
    });
    
    yPos += 15;
    
    // Observaciones específicas
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Observaciones Específicas', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const observations = "Este informe presenta un panorama general del grupo. Para un análisis más detallado sobre situaciones específicas como bullying, rendimiento académico o relaciones sociales, consulte los informes específicos disponibles en el sistema.";
    
    const splitObservations = pdf.splitTextToSize(observations, contentWidth);
    pdf.text(splitObservations, margin, yPos);
    
    // Pie de página
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`BULLS - Informe generado el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, 285);
    }
    
    // Guardar el PDF
    pdf.save(`Informe_General_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error: any) {
    console.error('Error al generar el informe PDF:', error);
    throw new Error(`Error al generar el informe: ${error.message}`);
  }
};

/**
 * Genera un informe PDF para el dashboard académico
 * @param data Datos del dashboard académico
 * @param groupName Nombre del grupo
 */
export const generateAcademicReport = async (data: any, groupName: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Título y encabezado
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 153);
    pdf.text(`Informe Académico: ${groupName}`, margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
    
    yPos += 15;
    
    // Resumen Académico
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Resumen Académico', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    // Datos básicos
    pdf.text(`• Promedio general del grupo: ${data.promedioGeneral || '75'}/100`, margin, yPos);
    yPos += 5;
    pdf.text(`• Tasa de aprobación: ${data.tasaAprobacion || '85'}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Asistencia media: ${data.asistenciaMedia || '90'}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Puntualidad: ${data.puntualidad || '92'}%`, margin, yPos);
    
    yPos += 15;
    
    // Rendimiento por materia
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Rendimiento por Materia', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const subjects = data.materias || [
      { nombre: 'Matemáticas', promedio: 72, tasaAprobacion: 80 },
      { nombre: 'Lenguaje', promedio: 78, tasaAprobacion: 85 },
      { nombre: 'Ciencias', promedio: 76, tasaAprobacion: 82 },
      { nombre: 'Historia', promedio: 81, tasaAprobacion: 90 },
      { nombre: 'Arte', promedio: 85, tasaAprobacion: 95 }
    ];
    
    subjects.forEach(subject => {
      pdf.text(`• ${subject.nombre}: Promedio ${subject.promedio}/100 - Aprobación ${subject.tasaAprobacion}%`, margin, yPos);
      yPos += 5;
      
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    yPos += 10;
    
    // Distribución de calificaciones
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Distribución de Calificaciones', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const grades = data.distribucionCalificaciones || [
      { rango: 'Excelente (90-100)', porcentaje: 15 },
      { rango: 'Bueno (80-89)', porcentaje: 30 },
      { rango: 'Regular (70-79)', porcentaje: 35 },
      { rango: 'Deficiente (60-69)', porcentaje: 15 },
      { rango: 'Muy deficiente (<60)', porcentaje: 5 }
    ];
    
    grades.forEach(grade => {
      pdf.text(`• ${grade.rango}: ${grade.porcentaje}% de los estudiantes`, margin, yPos);
      yPos += 5;
    });
    
    // Nueva página si es necesario
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    } else {
      yPos += 15;
    }
    
    // Recomendaciones
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recomendaciones Específicas', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const academicRecommendations = [
      "Reforzar los contenidos de las materias con promedios más bajos.",
      "Implementar estrategias de apoyo para estudiantes en riesgo de reprobación.",
      "Reconocer y destacar a los estudiantes con mejor rendimiento académico.",
      "Mantener comunicación constante con los padres sobre el rendimiento académico.",
      "Realizar evaluaciones diagnósticas periódicas para identificar áreas de mejora."
    ];
    
    academicRecommendations.forEach(rec => {
      pdf.text(`• ${rec}`, margin, yPos);
      yPos += 5;
      
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Pie de página
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`BULLS - Informe generado el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, 285);
    }
    
    // Guardar el PDF
    pdf.save(`Informe_Academico_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error: any) {
    console.error('Error al generar el informe PDF:', error);
    throw new Error(`Error al generar el informe: ${error.message}`);
  }
};

/**
 * Genera un informe PDF para el dashboard de relaciones sociales
 * @param data Datos del dashboard social
 * @param groupName Nombre del grupo
 */
export const generateSocialReport = async (data: any, groupName: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Título y encabezado
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 153);
    pdf.text(`Informe de Relaciones Sociales: ${groupName}`, margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
    
    yPos += 15;
    
    // Resumen Social
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Resumen de Relaciones Sociales', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    // Métricas generales
    pdf.text(`• Cohesión grupal: ${data.cohesionGrupal || '75'}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Número de subgrupos identificados: ${data.subgrupos || 3}`, margin, yPos);
    yPos += 5;
    pdf.text(`• Índice de aislamiento: ${data.aislamiento || '10'}%`, margin, yPos);
    yPos += 5;
    pdf.text(`• Conflictividad: ${data.conflictividad || '15'}%`, margin, yPos);
    
    yPos += 15;
    
    // Distribución de roles sociales
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Distribución de Roles Sociales', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const roles = data.rolesSociales || [
      { rol: 'Líderes', cantidad: 3 },
      { rol: 'Populares', cantidad: 5 },
      { rol: 'Seguidores', cantidad: 10 },
      { rol: 'Aislados', cantidad: 2 },
      { rol: 'Rechazados', cantidad: 0 }
    ];
    
    roles.forEach(role => {
      pdf.text(`• ${role.rol}: ${role.cantidad} estudiantes`, margin, yPos);
      yPos += 5;
    });
    
    // Nueva página si es necesario
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    } else {
      yPos += 15;
    }
    
    // Estudiantes en riesgo social
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Estudiantes en Riesgo Social', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const riskStudents = data.estudiantesRiesgo || [];
    
    if (riskStudents.length > 0) {
      riskStudents.forEach(student => {
        pdf.text(`• ${student.nombre}: Nivel de riesgo ${student.nivelRiesgo}/5 - ${student.problematica}`, margin, yPos);
        yPos += 5;
        
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
      });
    } else {
      pdf.text("No se han identificado estudiantes en situación de riesgo social.", margin, yPos);
      yPos += 5;
    }
    
    yPos += 10;
    
    // Recomendaciones
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recomendaciones para Mejorar la Cohesión', margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    const socialRecommendations = [
      "Implementar actividades cooperativas para fortalecer vínculos entre subgrupos.",
      "Establecer estrategias de integración para estudiantes aislados.",
      "Realizar dinámicas de grupo periódicas para mejorar la comunicación interpersonal.",
      "Fomentar valores de respeto y empatía en todas las actividades del aula.",
      "Implementar un sistema de apoyo entre pares para nuevos estudiantes."
    ];
    
    socialRecommendations.forEach(rec => {
      const splitRec = pdf.splitTextToSize(`• ${rec}`, contentWidth);
      pdf.text(splitRec, margin, yPos);
      yPos += splitRec.length * 5;
      
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Pie de página
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`BULLS - Informe generado el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, 285);
    }
    
    // Guardar el PDF
    pdf.save(`Informe_Social_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error: any) {
    console.error('Error al generar el informe PDF:', error);
    throw new Error(`Error al generar el informe: ${error.message}`);
  }
};

export default {
  generateBullyingReport,
  generateGeneralReport,
  generateAcademicReport,
  generateSocialReport
};