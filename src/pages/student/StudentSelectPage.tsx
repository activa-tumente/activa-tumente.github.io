import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsApi, studentsApi, responsesApi } from '../../lib/api';
import type { Student } from '../../types/data';
import { UserCheck, UserX } from 'lucide-react';

const StudentSelectPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [completedStudents, setCompletedStudents] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError('No se proporcionó ID de grupo.');
      setLoading(false);
      return;
    }

    const loadGroupAndStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar información del grupo
        const group = await groupsApi.getById(groupId);
        if (!group) {
          setError(`Grupo con ID "${groupId}" no encontrado`);
          return;
        }

        setGroupName(group.nombre);

        // Cargar estudiantes del grupo
        const loadedStudents = await studentsApi.getByGroup(groupId);
        const mappedStudents: Student[] = loadedStudents.map((student) => ({
          id: student.id,
          name: `${student.nombre_estudiante} ${student.apellido_estudiante}` // Mostramos nombre completo
        }));

        setStudents(mappedStudents);

        // Verificar cuáles estudiantes ya han completado el cuestionario
        const completedIds = new Set<string>();

        // Verificar cada estudiante
        for (const student of loadedStudents) {
          try {
            const hasCompleted = await responsesApi.hasStudentCompletedQuestionnaire(student.id, groupId);
            if (hasCompleted) {
              completedIds.add(student.id);
            }
          } catch (error) {
            console.error(`Error al verificar respuestas para estudiante ${student.id}:`, error);
          }
        }

        setCompletedStudents(completedIds);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadGroupAndStudents();
  }, [groupId]);

  const handleStudentSelect = (studentId: string) => {
    if (completedStudents.has(studentId)) {
      alert('Este estudiante ya ha completado el cuestionario.');
      return;
    }
    if (groupId) {
      navigate(`/student/questionnaire/${groupId}/${studentId}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando estudiantes...</div>;
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

  const availableStudents = students.filter(s => !completedStudents.has(s.id));
  const doneStudents = students.filter(s => completedStudents.has(s.id));

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-1 text-gray-700">Estudiantes de {groupName}</h2>
      <p className="text-gray-600 mb-6">Selecciona tu nombre de la lista</p>

      {students.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-6">No hay estudiantes registrados en este grupo.</p>
          <button
            onClick={() => navigate('/student')}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a selección de colegio
          </button>
        </div>
      ) : (
        <>
          {availableStudents.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-2 text-gray-600">Pendientes:</h3>
              <div className="space-y-3 mb-6">
                {availableStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleStudentSelect(student.id)}
                    className="flex items-center justify-between w-full text-left p-4 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 hover:border-blue-300 transition duration-200 text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {student.name}
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </button>
                ))}
              </div>
            </>
          )}

          {doneStudents.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-2 text-gray-500">Ya completados:</h3>
              <div className="space-y-3">
                {doneStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between w-full p-4 bg-green-100 border border-green-200 rounded-md text-green-700"
                  >
                    {student.name}
                    <UserX className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StudentSelectPage;
