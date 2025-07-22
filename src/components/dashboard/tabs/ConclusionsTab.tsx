import React from 'react';

interface ConclusionsTabProps {
  hallazgos: string[];
  recomendaciones: string[];
}

const ConclusionsTab: React.FC<ConclusionsTabProps> = ({ hallazgos, recomendaciones }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hallazgos Principales</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {hallazgos.map((hallazgo, index) => (
            <li key={index}>{hallazgo}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {recomendaciones.map((recomendacion, index) => (
            <li key={index}>{recomendacion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConclusionsTab;