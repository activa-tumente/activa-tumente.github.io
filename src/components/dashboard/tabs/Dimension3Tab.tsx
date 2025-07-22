import React from 'react';

const Dimension3Tab = ({ formasAgresionData, lugaresAgresionData, frecuenciaData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formas de Agresión */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Agresión</h3>
          <div className="space-y-3">
            {formasAgresionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                <span className="font-medium text-gray-900">{item.tipo}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${item.porcentaje}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: item.color }}>{item.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lugares de Agresión */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lugares de Agresión</h3>
          <div className="space-y-3">
            {lugaresAgresionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                <span className="font-medium text-gray-900">{item.lugar}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${item.porcentaje}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: item.color }}>{item.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frecuencia */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frecuencia de Agresiones</h3>
        <div className="space-y-3">
          {frecuenciaData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-gray-900">{item.frecuencia}</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-3 mr-2">
                  <div 
                    className="bg-purple-500 h-3 rounded-full" 
                    style={{ width: `${item.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-purple-600">{item.porcentaje}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dimension3Tab;