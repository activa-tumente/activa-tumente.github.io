import React, { useState } from 'react';
import { Download, FileText, Image, Table, Loader2 } from 'lucide-react';
import bullsAnalysisService from '../../services/bullsAnalysisService';

interface ExportButtonProps {
  grupoId?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ grupoId, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Generar análisis completo
      const analisis = await bullsAnalysisService.executeCompleteAnalysis(undefined, undefined, grupoId || 'grupo_6ab_lasalle');
      
      // Crear contenido HTML para PDF
      const htmlContent = generateHTMLReport(analisis);
      
      // Crear un blob con el contenido HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-bulls-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el reporte. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const analisis = await bullsAnalysisService.executeCompleteAnalysis(undefined, undefined, grupoId || 'grupo_6ab_lasalle');
      
      // Generar CSV con datos de estudiantes
      const csvContent = generateCSVReport(analisis);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `datos-bulls-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al generar el archivo CSV. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      const analisis = await bullsAnalysisService.executeCompleteAnalysis(undefined, undefined, grupoId || 'grupo_6ab_lasalle');
      
      const jsonContent = JSON.stringify(analisis, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-completo-bulls-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      alert('Error al generar el archivo JSON. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const generateHTMLReport = (analisis: any) => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Análisis Sociométrico BULL-S - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .kpi-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; text-align: center; }
        .kpi-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        .table th { background-color: #f9fafb; font-weight: bold; }
        .alert { border-left: 4px solid #ef4444; background-color: #fef2f2; padding: 15px; margin: 10px 0; }
        .recommendation { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Análisis Sociométrico BULL-S</h1>
        <h2>Evaluación de Dinámicas Sociales y Bullying</h2>
        <p>Grupo: ${analisis.grupo_id}</p>
        <p>Fecha de análisis: ${new Date(analisis.fecha_analisis).toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Resumen Ejecutivo</h2>
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value">${analisis.resumen_ejecutivo.total_estudiantes}</div>
                <div>Total Estudiantes</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${analisis.resumen_ejecutivo.tasa_respuesta}%</div>
                <div>Tasa de Respuesta</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${analisis.metricas_red.densidad_general}%</div>
                <div>Densidad de Red</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${analisis.alertas.length}</div>
                <div>Alertas Identificadas</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Distribución de Estatus Social</h2>
        <table class="table">
            <thead>
                <tr><th>Estatus</th><th>Cantidad</th><th>Porcentaje</th></tr>
            </thead>
            <tbody>
                ${Object.entries(analisis.resumen_ejecutivo.distribucion_estatus).map(([estatus, cantidad]) => `
                    <tr>
                        <td>${estatus}</td>
                        <td>${cantidad}</td>
                        <td>${((cantidad as number / analisis.resumen_ejecutivo.total_estudiantes) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Distribución de Roles de Bullying</h2>
        <table class="table">
            <thead>
                <tr><th>Rol</th><th>Cantidad</th><th>Porcentaje</th></tr>
            </thead>
            <tbody>
                ${Object.entries(analisis.resumen_ejecutivo.distribucion_roles).map(([rol, cantidad]) => `
                    <tr>
                        <td>${rol}</td>
                        <td>${cantidad}</td>
                        <td>${((cantidad as number / analisis.resumen_ejecutivo.total_estudiantes) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Alertas de Riesgo</h2>
        ${analisis.alertas.map(alerta => `
            <div class="alert">
                <h4>${alerta.tipo.toUpperCase()} - Severidad: ${alerta.severidad.toUpperCase()}</h4>
                <p><strong>Descripción:</strong> ${alerta.descripcion}</p>
                <p><strong>Recomendaciones:</strong></p>
                <ul>
                    ${alerta.recomendaciones.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Análisis Individual de Estudiantes</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Estatus Social</th>
                    <th>Rol Bullying</th>
                    <th>Popularidad</th>
                    <th>Rechazo</th>
                    <th>Nivel de Riesgo</th>
                </tr>
            </thead>
            <tbody>
                ${analisis.indices_individuales.map(indice => {
                  const estudiante = analisis.estudiantes.find(e => e.id === indice.estudiante_id);
                  return `
                    <tr>
                        <td>${estudiante?.nombre || 'N/A'}</td>
                        <td>${indice.estatus_social}</td>
                        <td>${indice.rol_bullying}</td>
                        <td>${indice.popularidad.toFixed(1)}%</td>
                        <td>${indice.rechazo.toFixed(1)}%</td>
                        <td>${indice.nivel_riesgo}</td>
                    </tr>
                  `;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Recomendaciones Principales</h2>
        ${analisis.resumen_ejecutivo.recomendaciones_principales.map(rec => `
            <div class="recommendation">
                <p>${rec}</p>
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p>Análisis generado por Sistema BULL-S v2.0.0 - ${new Date().toLocaleDateString()}</p>
        <p>Este documento contiene información confidencial sobre estudiantes</p>
    </div>
</body>
</html>`;
  };

  const generateCSVReport = (analisis: any) => {
    const headers = [
      'Estudiante ID',
      'Nombre',
      'Estatus Social',
      'Rol Bullying',
      'Popularidad (%)',
      'Rechazo (%)',
      'Aislamiento (%)',
      'Centralidad',
      'Influencia Social',
      'Nivel de Riesgo'
    ];
    
    const rows = analisis.indices_individuales.map(indice => {
      const estudiante = analisis.estudiantes.find(e => e.id === indice.estudiante_id);
      return [
        indice.estudiante_id,
        estudiante?.nombre || 'N/A',
        indice.estatus_social,
        indice.rol_bullying,
        indice.popularidad.toFixed(2),
        indice.rechazo.toFixed(2),
        indice.aislamiento.toFixed(2),
        indice.centralidad.toFixed(2),
        indice.influencia_social.toFixed(2),
        indice.nivel_riesgo
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {isExporting ? 'Exportando...' : 'Exportar'}
      </button>

      {showMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            <button
              onClick={exportToPDF}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reporte HTML
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Table className="h-4 w-4 mr-2" />
              Datos CSV
            </button>
            <button
              onClick={exportToJSON}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              Datos JSON
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;