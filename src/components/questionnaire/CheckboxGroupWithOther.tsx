import React, { useState, useEffect } from 'react';

    interface CheckboxGroupValue {
      selected: string[];
      other: string;
    }

    interface CheckboxGroupWithOtherProps {
      questionId: string;
      options: string[];
      value: CheckboxGroupValue; // { selected: ['Option 1'], other: 'Some text' }
      onChange: (questionId: string, newValue: CheckboxGroupValue) => void;
      otherLabel?: string;
    }

    const CheckboxGroupWithOther: React.FC<CheckboxGroupWithOtherProps> = ({
      questionId,
      options,
      value,
      onChange,
      otherLabel = 'Otras formas / Otros lugares:',
    }) => {
      // Ensure value is initialized correctly
      const currentSelected = value?.selected ?? [];
      const currentOther = value?.other ?? '';

      const handleCheckboxChange = (option: string, isChecked: boolean) => {
        // Si está marcado, seleccionar solo esta opción (como un radio button)
        // Si está desmarcado, quitar la selección
        const newSelected = isChecked ? [option] : [];
        onChange(questionId, { selected: newSelected, other: currentOther });
      };

      const handleOtherTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Si se escribe algo en "Otro", deseleccionar las otras opciones
        const otherText = event.target.value;
        if (otherText.trim() !== '') {
          onChange(questionId, { selected: [], other: otherText });
        } else {
          onChange(questionId, { selected: currentSelected, other: otherText });
        }
      };

      return (
        <div className="space-y-3">
          {options.map((option, index) => (
            <label key={index} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`${questionId}`}
                value={option}
                checked={currentSelected.includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
          {/* "Other" Option */}
          <div className="pt-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">
                {otherLabel} (Especificar)
             </label>
             <input
                type="text"
                value={currentOther}
                onChange={handleOtherTextChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Escribe aquí si marcaste 'Otras' o tienes algo más que añadir"
             />
          </div>
        </div>
      );
    };

    export default CheckboxGroupWithOther;
