import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface QualitativeAnalysisProps {
  groupId: string;
  data?: {
    generalObservations: string;
    strengths: string[];
    challenges: string[];
    trends: {
      increasing: string[];
      decreasing: string[];
    };
  };
}

const defaultData = {
  generalObservations: "El grupo presenta un nivel medio-bajo de bullying, con algunos casos puntuales que requieren atención. La dinámica general es positiva, aunque existen subgrupos claramente definidos que podrían contribuir a la exclusión social de algunos estudiantes.",
  strengths: [
    "Buena cohesión general entre la mayoría de estudiantes",
    "Bajo nivel de agresiones físicas",
    "Presencia de líderes positivos que pueden influir en el grupo",
    "Disposición para participar en actividades colaborativas"
  ],
  challenges: [
    "Presencia de agresiones verbales frecuentes entre algunos estudiantes",
    "Exclusión social de 3-4 estudiantes identificados como vulnerables",
    "Falta de intervención de observadores cuando ocurren situaciones de bullying",
    "Uso ocasional de redes sociales para prolongar conflictos fuera del aula"
  ],
  trends: {
    increasing: [
      "Conciencia sobre el impacto del bullying",
      "Disposición para reportar incidentes a docentes",
      "Integración de estudiantes nuevos"
    ],
    decreasing: [
      "Agresiones físicas",
      "Tolerancia hacia comportamientos agresivos",
      "Conflictos durante actividades deportivas"
    ]
  }
};

const QualitativeAnalysis: React.FC<QualitativeAnalysisProps> = ({ groupId, data = defaultData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Observaciones Generales</h3>
        <p className="text-gray-700">{data.generalObservations}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
            <span className="mr-2">Fortalezas del Grupo</span>
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
            <span className="mr-2">Desafíos a Abordar</span>
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.challenges.map((challenge, index) => (
              <li key={index} className="text-gray-700">{challenge}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Tendencias Observadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span>En Aumento</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.trends.increasing.map((trend, index) => (
                <li key={index} className="text-gray-700">{trend}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center">
              <TrendingDown className="h-5 w-5 text-blue-600 mr-2" />
              <span>En Disminución</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.trends.decreasing.map((trend, index) => (
                <li key={index} className="text-gray-700">{trend}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Este análisis cualitativo se basa en la interpretación de los datos recopilados y la observación del comportamiento grupal. Se recomienda complementar con observaciones directas en el aula.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualitativeAnalysis;
