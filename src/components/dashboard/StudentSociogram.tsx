import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Student {
  id: string;
  name: string;
  bullying_role?: string;
  sociometric_status?: string;
  positive_nominations?: number;
  negative_nominations?: number;
}

interface StudentNodeProps {
  student: Student;
  x: number;
  y: number;
  selected: boolean;
  onClick: () => void;
}

const StudentNode: React.FC<StudentNodeProps> = ({ student, x, y, selected, onClick }) => {
  // Get color based on bullying role
  const getRoleColor = () => {
    switch (student.bullying_role) {
      case 'Bully': return '#ff8042';
      case 'Victim': return '#0088fe';
      case 'Bully-Victim': return '#ff0000';
      default: return '#00c49f';
    }
  };
  
  // Get border color based on sociometric status
  const getStatusBorderColor = () => {
    switch (student.sociometric_status) {
      case 'Popular': return '#8884d8';
      case 'Rejected': return '#fa8072';
      case 'Isolated': return '#d3d3d3';
      case 'Controversial': return '#ffbb28';
      default: return '#82ca9d';
    }
  };
  
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle 
        r={20} 
        fill={getRoleColor()} 
        stroke={selected ? '#000' : getStatusBorderColor()} 
        strokeWidth={selected ? 3 : 2}
      />
      <text 
        textAnchor="middle" 
        dy=".3em" 
        fill="white" 
        fontSize="10px"
        fontWeight="bold"
      >
        {student.name.substring(0, 2)}
      </text>
      {selected && (
        <text 
          textAnchor="middle" 
          y={35} 
          fill="#333" 
          fontSize="12px"
          fontWeight="500"
        >
          {student.name}
        </text>
      )}
    </g>
  );
};

interface StudentSociogramProps {
  groupId: string;
  onStudentSelect?: (studentId: string) => void;
}

const StudentSociogram: React.FC<StudentSociogramProps> = ({ groupId, onStudentSelect }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // Fetch student data with bullying indicators
        const { data, error } = await supabase
          .from('view_dashboard_bullying_indicators')
          .select('id, nombre_estudiante, bullying_role, sociometric_status, positive_nominations, negative_nominations')
          .eq('grupo_id', groupId);
        
        if (error) throw error;
        
        if (data) {
          // Map to our Student interface
          const mappedStudents = data.map(item => ({
            id: item.id,
            name: item.nombre_estudiante,
            bullying_role: item.bullying_role,
            sociometric_status: item.sociometric_status,
            positive_nominations: item.positive_nominations,
            negative_nominations: item.negative_nominations
          }));
          
          setStudents(mappedStudents);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Error al cargar los datos de los estudiantes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [groupId]);
  
  if (loading) {
    return <div className="text-center py-8">Cargando datos de estudiantes...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  if (students.length === 0) {
    return <div className="text-center py-8">No hay datos de estudiantes disponibles</div>;
  }
  
  // Calculate positions in a circle layout
  const calculatePositions = () => {
    const centerX = 300;
    const centerY = 200;
    const radius = 150;
    
    return students.map((student, index) => {
      const angle = (index / students.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return {
        ...student,
        x,
        y
      };
    });
  };
  
  const positionedStudents = calculatePositions();
  
  const handleStudentClick = (studentId: string) => {
    const newSelectedId = selectedStudent === studentId ? null : studentId;
    setSelectedStudent(newSelectedId);
    
    // If external handler is provided and a student is selected, call it
    if (onStudentSelect && newSelectedId) {
      onStudentSelect(newSelectedId);
    }
  };
  
  // Legend component
  const Legend = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-4 p-2 bg-gray-50 rounded-md">
      <div>
        <span className="font-semibold">Roles:</span>
        <div className="flex items-center space-x-2 mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#ff8042]"></span>
          <span className="text-xs">Agresor</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#0088fe] ml-2"></span>
          <span className="text-xs">Víctima</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#ff0000] ml-2"></span>
          <span className="text-xs">Agresor/Víctima</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#00c49f] ml-2"></span>
          <span className="text-xs">No Implicado</span>
        </div>
      </div>
      <div>
        <span className="font-semibold">Estatus Sociométrico:</span>
        <div className="flex items-center space-x-2 mt-1">
          <span className="inline-block w-3 h-3 border-2 border-[#8884d8] rounded-full"></span>
          <span className="text-xs">Popular</span>
          <span className="inline-block w-3 h-3 border-2 border-[#fa8072] rounded-full ml-2"></span>
          <span className="text-xs">Rechazado</span>
          <span className="inline-block w-3 h-3 border-2 border-[#d3d3d3] rounded-full ml-2"></span>
          <span className="text-xs">Aislado</span>
          <span className="inline-block w-3 h-3 border-2 border-[#ffbb28] rounded-full ml-2"></span>
          <span className="text-xs">Controvertido</span>
        </div>
      </div>
    </div>
  );
  
  // Student details component
  const StudentDetails = () => {
    if (!selectedStudent) return null;
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return null;
    
    return (
      <div className="mt-4 p-4 bg-white border rounded-md shadow-sm">
        <h4 className="font-medium text-lg">{student.name}</h4>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <span className="text-gray-500 text-sm">Rol:</span>
            <p className="font-medium">{
              student.bullying_role === 'Bully' ? 'Agresor' :
              student.bullying_role === 'Victim' ? 'Víctima' :
              student.bullying_role === 'Bully-Victim' ? 'Agresor/Víctima' :
              'No Implicado'
            }</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Estatus:</span>
            <p className="font-medium">{student.sociometric_status}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Nominaciones positivas:</span>
            <p className="font-medium">{student.positive_nominations}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Nominaciones negativas:</span>
            <p className="font-medium">{student.negative_nominations}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="text-lg font-medium mb-4 text-center">Sociograma del Grupo</h3>
      
      <svg width="600" height="400" viewBox="0 0 600 400">
        {/* Draw lines for relationships (simplified) */}
        {selectedStudent && positionedStudents.map(s1 => {
          if (s1.id === selectedStudent) {
            // Only draw lines from selected student to others
            return positionedStudents
              .filter(s2 => s2.id !== selectedStudent)
              .map(s2 => {
                // Check if there's a positive or negative nomination
                const isPositive = Math.random() > 0.5; // This is a placeholder - in real app use actual data
                return (
                  <line 
                    key={`line-${s1.id}-${s2.id}`}
                    x1={s1.x}
                    y1={s1.y}
                    x2={s2.x}
                    y2={s2.y}
                    stroke={isPositive ? '#22c55e' : '#ef4444'}
                    strokeWidth={1.5}
                    strokeDasharray={isPositive ? '' : '5,5'}
                    opacity={0.5}
                  />
                );
              });
          }
          return null;
        })}
        
        {/* Draw student nodes */}
        {positionedStudents.map(student => (
          <StudentNode 
            key={student.id}
            student={student}
            x={student.x}
            y={student.y}
            selected={student.id === selectedStudent}
            onClick={() => handleStudentClick(student.id)}
          />
        ))}
      </svg>
      
      <Legend />
      <StudentDetails />
      
      <p className="text-sm text-gray-500 italic mt-4 text-center">
        Haga clic en un estudiante para ver más detalles y sus relaciones.
        <br />
        Esta visualización es simplificada - en una implementación completa, las líneas representarían nominaciones reales.
      </p>
    </div>
  );
};

export default StudentSociogram;