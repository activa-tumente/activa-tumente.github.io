import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import reportService from '../../services/reportService';

interface ExportReportButtonProps {
  groupData: any;
  bullyingStats: any;
  includeCharts?: boolean;
}

/**
 * Botón para exportar informes de bullying en PDF
 */
const ExportReportButton: React.FC<ExportReportButtonProps> = ({ 
  groupData, 
  bullyingStats,
  includeCharts = true
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      
      await reportService.generateBullyingReport(groupData, bullyingStats, includeCharts);
      
      setIsExporting(false);
    } catch (err) {
      console.error('Error al exportar informe:', err);
      setError('Error al generar el informe. Inténtelo de nuevo.');
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-dark hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Generando PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Exportar Informe PDF
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default ExportReportButton;
