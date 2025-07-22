import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { institutionsApi, groupsApi, studentsApi } from '../../lib/api';
import type { Group } from '../../types/data';
import { Users } from 'lucide-react';

const GroupSelectPage: React.FC = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [institutionName, setInstitutionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!institutionId) {
      setError('No se proporcionó ID de institución');
      setLoading(false);
      return;
    }

    const loadInstitutionAndGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar la institución
        const institution = await institutionsApi.getById(institutionId);
        if (!institution) {
          setError(`Institución con ID "${institutionId}" no encontrada`);
          return;
        }

        setInstitutionName(institution.nombre);

        // Cargar los grupos de la institución
        const loadedGroups = await groupsApi.getByInstitution(institutionId);
        
        // Crear un array para almacenar los grupos con sus estudiantes
        const mappedGroups: Group[] = [];
        
        // Para cada grupo, cargar sus estudiantes
        for (const group of loadedGroups) {
          // Cargar estudiantes del grupo
          const students = await studentsApi.getByGroup(group.id);
          
          // Mapear el grupo con sus estudiantes
          mappedGroups.push({
            id: group.id,
            name: group.nombre,
            students: students.map(student => ({
              id: student.id,
              name: student.nombre_estudiante
            }))
          });
        }

        setGroups(mappedGroups);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadInstitutionAndGroups();
  }, [institutionId]);

  const handleGroupSelect = (groupId: string) => {
    navigate(`/student/select-student/${groupId}`);
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando grupos...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/student')}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver a selección de colegio
        </button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">No hay grupos disponibles</h2>
        <p className="text-gray-600 mb-6">
          El colegio {institutionName} no tiene grupos registrados.
        </p>
        <button
          onClick={() => navigate('/student')}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver a selección de colegio
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-1 text-gray-700">Grupos de {institutionName}</h2>
      <p className="text-gray-600 mb-6">Selecciona tu grupo</p>

      <div className="space-y-3">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => handleGroupSelect(group.id)}
            className="flex items-center justify-between w-full text-left p-4 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 hover:border-blue-300 transition duration-200 text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div className="flex items-center">
              <Users className="mr-3 h-5 w-5" />
              <span>{group.name}</span>
            </div>
            <span className="text-sm text-blue-600">{group.students?.length || 0} estudiantes</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupSelectPage;
