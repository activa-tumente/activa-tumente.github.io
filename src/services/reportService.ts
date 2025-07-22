import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Servicio para generar y exportar informes
 */
export const reportService = {
  /**
   * Genera un informe PDF del dashboard de bullying
   * @param groupData Datos del grupo
   * @param bullyingStats Estadísticas de bullying
   * @param includeCharts Indica si se deben incluir gráficos
   */
  async generateBullyingReport(groupData: any, bullyingStats: any, includeCharts = true) {
    try {
      // Crear documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Configuración de fuentes y colores
      const titleColor = '#1e3a8a'; // Azul oscuro
      const subtitleColor = '#2563eb'; // Azul
      const textColor = '#1f2937'; // Gris oscuro
      
      // Añadir encabezado
      doc.setFontSize(20);
      doc.setTextColor(titleColor);
      doc.text('Informe de Bullying', 105, 20, { align: 'center' });
      
      // Añadir información del grupo
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Información del Grupo', 20, 35);
      
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      doc.text(`Grupo: ${groupData.nombre}`, 20, 45);
      doc.text(`Institución: ${groupData.instituciones_educativas?.nombre || 'No especificada'}`, 20, 52);
      doc.text(`Año Escolar: ${groupData.año_escolar || 'No especificado'}`, 20, 59);
      doc.text(`Fecha del informe: ${new Date().toLocaleDateString()}`, 20, 66);
      
      // Añadir índices generales
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Índices Generales', 20, 80);
      
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      doc.text(`Índice de Bullying: ${(bullyingStats.bullyingIndex * 100).toFixed(1)}%`, 20, 90);
      doc.text(`Índice de Victimización: ${(bullyingStats.victimizationIndex * 100).toFixed(1)}%`, 20, 97);
      
      // Añadir distribución por roles
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Distribución por Roles', 20, 115);
      
      // Tabla de roles
      const rolesTableData = bullyingStats.byRole.map((role: any) => [
        role.name,
        role.value,
        `${((role.value / bullyingStats.byRole.reduce((sum: number, r: any) => sum + r.value, 0)) * 100).toFixed(1)}%`
      ]);
      
      (doc as any).autoTable({
        startY: 120,
        head: [['Rol', 'Cantidad', 'Porcentaje']],
        body: rolesTableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 }
      });
      
      // Añadir tipos de agresión
      const currentY = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Tipos de Agresión', 20, currentY);
      
      // Tabla de tipos de agresión
      const typesTableData = bullyingStats.byType.map((type: any) => [
        type.name,
        `${type.value}%`
      ]);
      
      (doc as any).autoTable({
        startY: currentY + 5,
        head: [['Tipo', 'Porcentaje']],
        body: typesTableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 }
      });
      
      // Si se incluyen gráficos, capturar y añadir
      if (includeCharts) {
        try {
          // Añadir nueva página para gráficos
          doc.addPage();
          
          doc.setFontSize(16);
          doc.setTextColor(titleColor);
          doc.text('Gráficos de Análisis', 105, 20, { align: 'center' });
          
          // Capturar gráficos si están disponibles en el DOM
          const rolesChartElement = document.querySelector('#roles-chart-container canvas');
          const typesChartElement = document.querySelector('#types-chart-container canvas');
          
          if (rolesChartElement) {
            const rolesCanvas = await html2canvas(rolesChartElement as HTMLElement);
            const rolesImgData = rolesCanvas.toDataURL('image/png');
            
            doc.setFontSize(14);
            doc.setTextColor(subtitleColor);
            doc.text('Distribución por Roles', 20, 35);
            
            doc.addImage(rolesImgData, 'PNG', 20, 40, 170, 85);
          }
          
          if (typesChartElement) {
            const typesCanvas = await html2canvas(typesChartElement as HTMLElement);
            const typesImgData = typesCanvas.toDataURL('image/png');
            
            doc.setFontSize(14);
            doc.setTextColor(subtitleColor);
            doc.text('Tipos de Agresión', 20, 140);
            
            doc.addImage(typesImgData, 'PNG', 20, 145, 170, 85);
          }
        } catch (chartError) {
          console.warn('No se pudieron incluir los gráficos en el informe:', chartError);
        }
      }
      
      // Añadir página de recomendaciones
      doc.addPage();
      
      doc.setFontSize(16);
      doc.setTextColor(titleColor);
      doc.text('Recomendaciones de Intervención', 105, 20, { align: 'center' });
      
      // Recomendaciones generales
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Recomendaciones a Nivel Grupal', 20, 35);
      
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      
      const groupRecommendations = [
        'Implementar sesiones de sensibilización sobre el bullying y sus consecuencias',
        'Establecer normas claras de convivencia con la participación de los estudiantes',
        'Realizar actividades de cohesión grupal para fortalecer relaciones positivas',
        'Implementar un sistema de reporte confidencial de situaciones de bullying'
      ];
      
      let yPos = 45;
      groupRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 7;
      });
      
      // Recomendaciones para roles específicos
      doc.setFontSize(14);
      doc.setTextColor(subtitleColor);
      doc.text('Recomendaciones según Roles', 20, yPos + 10);
      
      // Víctimas
      doc.setFontSize(12);
      doc.setTextColor(subtitleColor);
      doc.text('Para Víctimas:', 25, yPos + 20);
      
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      
      const victimRecommendations = [
        'Proporcionar apoyo psicológico individual',
        'Desarrollar habilidades de asertividad y autodefensa',
        'Fortalecer la autoestima y el autoconcepto'
      ];
      
      yPos += 30;
      victimRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 30, yPos);
        yPos += 7;
      });
      
      // Agresores
      doc.setFontSize(12);
      doc.setTextColor(subtitleColor);
      doc.text('Para Agresores:', 25, yPos + 5);
      
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      
      const bullyRecommendations = [
        'Intervención individual con enfoque en empatía y control de impulsos',
        'Establecer consecuencias claras para comportamientos agresivos',
        'Identificar y abordar posibles causas subyacentes del comportamiento'
      ];
      
      yPos += 15;
      bullyRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 30, yPos);
        yPos += 7;
      });
      
      // Pie de página
      const totalPages = doc.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
          `BULL-S | Informe generado el ${new Date().toLocaleDateString()} | Página ${i} de ${totalPages}`,
          105, 
          285, 
          { align: 'center' }
        );
      }
      
      // Guardar el PDF
      doc.save(`Informe_Bullying_${groupData.nombre}_${new Date().toLocaleDateString().replace(/\\//g, '-')}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error al generar el informe PDF:', error);
      throw error;
    }
  }
};

export default reportService;
