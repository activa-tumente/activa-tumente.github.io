import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { institutionsApi } from '../../lib/api';
import type { Institution } from '../../types/data';
import { School } from 'lucide-react';

const InstitutionSelectPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedInstitutions = await institutionsApi.getAll();
        const mappedInstitutions: Institution[] = loadedInstitutions.map(inst => ({
          id: inst.id,
          name: inst.nombre,
          address: inst.direccion || undefined,
          groups: [] // Los grupos se cargarán en la siguiente vista
        }));
        setInstitutions(mappedInstitutions);
      } catch (err) {
        console.error('Error al cargar instituciones:', err);
        setError('No se pudieron cargar las instituciones. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const handleContinue = () => {
    if (selectedInstitution) {
      navigate(`/student/select-group/${selectedInstitution.id}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando colegios...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Selecciona Tu Colegio</h2>
      
      {institutions.length === 0 ? (
        <p className="text-gray-500">No hay colegios disponibles. Contacta al administrador.</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {institutions.map((institution) => (
              <button
                key={institution.id}
                onClick={() => handleInstitutionSelect(institution)}
                className={`flex items-center w-full text-left p-4 border rounded-md transition duration-200 ${
                  selectedInstitution?.id === institution.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <School className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">{institution.name}</p>
                  {institution.address && (
                    <p className="text-sm text-gray-600">{institution.address}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedInstitution}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </>
      )}
    </div>
  );
};

export default InstitutionSelectPage;
