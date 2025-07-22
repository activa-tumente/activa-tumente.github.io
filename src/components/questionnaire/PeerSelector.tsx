import React from 'react';
    import Select, { MultiValue } from 'react-select';
    import type { QuestionOption } from '../../lib/questionnaireData';

    interface PeerSelectorProps {
      questionId: string;
      options: QuestionOption[]; // List of classmates { value: studentId, label: studentName }
      value: QuestionOption[]; // Currently selected peers
      onChange: (questionId: string, selectedOptions: QuestionOption[]) => void;
      maxSelections: number;
      placeholder?: string;
      requireExact?: boolean; // Si se requiere exactamente el número máximo de selecciones
    }

    const PeerSelector: React.FC<PeerSelectorProps> = ({
      questionId,
      options,
      value,
      onChange,
      maxSelections,
      placeholder,
      requireExact = false
    }) => {
      
      // Generar placeholder dinámico basado en si se requiere exacto
      const defaultPlaceholder = requireExact 
        ? `Debes seleccionar exactamente ${maxSelections} compañeros...`
        : `Selecciona hasta ${maxSelections} compañeros...`;
      
      const finalPlaceholder = placeholder || defaultPlaceholder;

      const handleChange = (selected: MultiValue<QuestionOption>) => {
        // Ensure selected is always an array
        const selectedArray = Array.isArray(selected) ? selected : [];

        // Si se intenta seleccionar más del límite, mostrar una alerta
        if (selectedArray.length > maxSelections) {
          alert(`Solo puedes seleccionar un máximo de ${maxSelections} compañeros.`);
        }

        // Limitar las selecciones al máximo permitido
        const limitedSelection = selectedArray.slice(0, maxSelections);
        onChange(questionId, limitedSelection);
      };

      // Ensure value is always an array for react-select
      const currentValue = Array.isArray(value) ? value : [];

      return (
        <div>
          <Select<QuestionOption, true> // Explicitly type as multi-select
            isMulti
            instanceId={`select-${questionId}`} // Unique instance ID for SSR/hydration
            name={questionId}
            options={options}
            value={currentValue}
            onChange={handleChange}
            placeholder={finalPlaceholder}
            noOptionsMessage={() => 'No hay más compañeros para seleccionar'}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{ // Basic styling, customize as needed
              control: (base) => ({
                ...base,
                borderColor: '#cbd5e1', // gray-300
                '&:hover': { borderColor: '#94a3b8' } // gray-400
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#e0f2fe', // sky-100
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#0c4a6e', // sky-800
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#0c4a6e', // sky-800
                ':hover': {
                  backgroundColor: '#0ea5e9', // sky-500
                  color: 'white',
                },
              }),
            }}
          />
          <p className={`text-sm mt-2 ${requireExact && currentValue.length !== maxSelections ? 'text-red-500' : 'text-gray-500'}`}>
            {requireExact 
              ? `Debes seleccionar exactamente ${maxSelections} compañeros.`
              : `Puedes seleccionar hasta ${maxSelections} compañeros.`
            }
            {currentValue.length > 0 && (
              <span className={requireExact && currentValue.length !== maxSelections ? 'text-red-600 font-medium' : ''}>
                {` Has seleccionado ${currentValue.length} de ${maxSelections}.`}
                {requireExact && currentValue.length !== maxSelections && ' ¡Faltan más selecciones!'}
              </span>
            )}
          </p>
        </div>
      );
    };

    export default PeerSelector;
