import React from 'react';
import { Clock } from 'lucide-react';

interface QuestionnaireNavigationProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  onQuestionClick: (index: number) => void;
  className?: string;
}

const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionClick,
  className = ''
}) => {
  // Crear array de números de pregunta
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  // Calcular progreso
  const progress = answeredQuestions.size;

  // Obtener hora actual
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Reloj */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-2xl font-mono text-gray-700">{currentTime}</span>
        </div>
      </div>

      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Navegación
      </h3>

      {/* Grid de preguntas */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {questionNumbers.map((questionNum) => {
          const questionIndex = questionNum - 1;
          const isAnswered = answeredQuestions.has(questionIndex);
          const isCurrent = questionIndex === currentQuestionIndex;
          
          return (
            <button
              key={questionNum}
              onClick={() => onQuestionClick(questionIndex)}
              className={`
                w-12 h-12 rounded-full font-semibold text-sm transition-all duration-200 
                flex items-center justify-center border-2
                ${isCurrent 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-110' 
                  : isAnswered 
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }
                ${!isCurrent ? 'hover:scale-105' : ''}
              `}
              title={`Pregunta ${questionNum}${isAnswered ? ' (Respondida)' : ' (Sin responder)'}`}
            >
              {questionNum}
            </button>
          );
        })}
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso</span>
          <span className="text-sm text-gray-600">{progress} de {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Información</h4>
        <div className="space-y-2 text-xs text-blue-700">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Pregunta actual</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Pregunta respondida</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span>Pregunta pendiente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireNavigation;