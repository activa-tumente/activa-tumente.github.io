import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface SociogramProps {
  groupId: string;
  data?: {
    nodes: Array<{
      id: string;
      name: string;
      role: 'victim' | 'bully' | 'bully-victim' | 'observer';
      connections: number;
      rejections: number;
    }>;
    connections: Array<{
      source: string;
      target: string;
      type: 'positive' | 'negative';
      strength: number;
    }>;
  };
}

// Datos de ejemplo para el sociograma
const defaultData = {
  nodes: [
    { id: '1', name: 'Ana García', role: 'observer', connections: 5, rejections: 1 },
    { id: '2', name: 'Carlos López', role: 'bully', connections: 3, rejections: 4 },
    { id: '3', name: 'María Rodríguez', role: 'victim', connections: 1, rejections: 6 },
    { id: '4', name: 'Juan Pérez', role: 'observer', connections: 4, rejections: 2 },
    { id: '5', name: 'Laura Martínez', role: 'observer', connections: 6, rejections: 0 },
    { id: '6', name: 'Pedro Sánchez', role: 'bully-victim', connections: 2, rejections: 5 },
    { id: '7', name: 'Sofía Fernández', role: 'observer', connections: 5, rejections: 1 },
    { id: '8', name: 'Diego González', role: 'observer', connections: 4, rejections: 2 },
    { id: '9', name: 'Valentina Torres', role: 'victim', connections: 1, rejections: 5 },
    { id: '10', name: 'Mateo Díaz', role: 'bully', connections: 3, rejections: 4 },
  ],
  connections: [
    { source: '1', target: '4', type: 'positive', strength: 2 },
    { source: '1', target: '5', type: 'positive', strength: 3 },
    { source: '1', target: '7', type: 'positive', strength: 2 },
    { source: '2', target: '6', type: 'negative', strength: 3 },
    { source: '2', target: '3', type: 'negative', strength: 3 },
    { source: '2', target: '10', type: 'positive', strength: 2 },
    { source: '3', target: '9', type: 'positive', strength: 1 },
    { source: '4', target: '1', type: 'positive', strength: 2 },
    { source: '4', target: '5', type: 'positive', strength: 2 },
    { source: '5', target: '1', type: 'positive', strength: 3 },
    { source: '5', target: '4', type: 'positive', strength: 2 },
    { source: '5', target: '7', type: 'positive', strength: 2 },
    { source: '5', target: '8', type: 'positive', strength: 2 },
    { source: '6', target: '9', type: 'negative', strength: 2 },
    { source: '6', target: '3', type: 'negative', strength: 2 },
    { source: '7', target: '1', type: 'positive', strength: 2 },
    { source: '7', target: '5', type: 'positive', strength: 2 },
    { source: '7', target: '8', type: 'positive', strength: 2 },
    { source: '8', target: '5', type: 'positive', strength: 2 },
    { source: '8', target: '7', type: 'positive', strength: 2 },
    { source: '10', target: '2', type: 'positive', strength: 2 },
    { source: '10', target: '3', type: 'negative', strength: 3 },
    { source: '10', target: '9', type: 'negative', strength: 3 },
  ]
};

const Sociogram: React.FC<SociogramProps> = ({ groupId, data = defaultData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Función para dibujar un sociograma básico
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurar dimensiones
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Colores según el rol
    const roleColors = {
      'victim': '#FF6B6B',
      'bully': '#FF9E40',
      'bully-victim': '#9775FA',
      'observer': '#4DABF7'
    };

    // Dibujar conexiones
    data.connections.forEach(connection => {
      const sourceNode = data.nodes.find(node => node.id === connection.source);
      const targetNode = data.nodes.find(node => node.id === connection.target);
      
      if (!sourceNode || !targetNode) return;
      
      // Calcular posiciones
      const sourceIndex = data.nodes.indexOf(sourceNode);
      const targetIndex = data.nodes.indexOf(targetNode);
      
      const sourceAngle = (sourceIndex / data.nodes.length) * Math.PI * 2;
      const targetAngle = (targetIndex / data.nodes.length) * Math.PI * 2;
      
      const sourceX = centerX + radius * Math.cos(sourceAngle);
      const sourceY = centerY + radius * Math.sin(sourceAngle);
      const targetX = centerX + radius * Math.cos(targetAngle);
      const targetY = centerY + radius * Math.sin(targetAngle);
      
      // Dibujar línea
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      
      // Estilo según tipo de conexión
      if (connection.type === 'positive') {
        ctx.strokeStyle = '#4CAF50';
      } else {
        ctx.strokeStyle = '#F44336';
      }
      
      // Grosor según fuerza
      ctx.lineWidth = connection.strength;
      ctx.stroke();
    });

    // Dibujar nodos
    data.nodes.forEach((node, index) => {
      const angle = (index / data.nodes.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Dibujar círculo
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = roleColors[node.role];
      ctx.fill();
      
      // Dibujar borde
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Dibujar texto
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name.split(' ')[0], x, y + 30);
    });

    // Dibujar leyenda
    const legendX = 20;
    let legendY = 30;
    const legendSpacing = 25;

    // Título de la leyenda
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Leyenda:', legendX, legendY);
    legendY += 25;

    // Roles
    Object.entries(roleColors).forEach(([role, color], index) => {
      // Dibujar círculo
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + index * legendSpacing, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Dibujar texto
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      
      let roleText = '';
      switch(role) {
        case 'victim': roleText = 'Víctima'; break;
        case 'bully': roleText = 'Agresor'; break;
        case 'bully-victim': roleText = 'Víctima-Agresor'; break;
        case 'observer': roleText = 'Observador'; break;
        default: roleText = role;
      }
      
      ctx.fillText(roleText, legendX + 25, legendY + 5 + index * legendSpacing);
    });

    // Tipos de conexiones
    legendY += 5 * legendSpacing;
    
    // Conexión positiva
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillText('Afinidad', legendX + 25, legendY + 5);
    
    // Conexión negativa
    legendY += legendSpacing;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.strokeStyle = '#F44336';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillText('Rechazo', legendX + 25, legendY + 5);

  }, [data]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Sociograma del Grupo</h3>
        
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            className="w-full h-auto border border-gray-200 rounded"
          />
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">Interpretación del Sociograma</h4>
          <p className="text-gray-600">
            El sociograma muestra las relaciones interpersonales dentro del grupo, destacando patrones de afinidad y rechazo. 
            Los estudiantes identificados como víctimas tienden a tener menos conexiones positivas y más rechazos, 
            mientras que los observadores suelen formar grupos cohesionados entre sí.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Estudiantes Populares</h3>
          <div className="space-y-3">
            {data.nodes
              .sort((a, b) => b.connections - a.connections)
              .slice(0, 3)
              .map(student => (
                <div key={student.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-medium">{student.name}</span>
                    <div className="text-sm text-gray-500">
                      {student.connections} conexiones positivas
                    </div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: 
                      student.role === 'victim' ? '#FF6B6B' : 
                      student.role === 'bully' ? '#FF9E40' : 
                      student.role === 'bully-victim' ? '#9775FA' : 
                      '#4DABF7' 
                    }}
                  />
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Estudiantes Aislados</h3>
          <div className="space-y-3">
            {data.nodes
              .sort((a, b) => a.connections - b.connections)
              .slice(0, 3)
              .map(student => (
                <div key={student.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-medium">{student.name}</span>
                    <div className="text-sm text-gray-500">
                      {student.rejections} rechazos recibidos
                    </div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: 
                      student.role === 'victim' ? '#FF6B6B' : 
                      student.role === 'bully' ? '#FF9E40' : 
                      student.role === 'bully-victim' ? '#9775FA' : 
                      '#4DABF7' 
                    }}
                  />
                </div>
              ))
            }
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
              Este sociograma se basa en las respuestas de los estudiantes a preguntas sobre sus preferencias y rechazos sociales.
              Las relaciones mostradas son una representación visual de estas respuestas y pueden ayudar a identificar dinámicas grupales importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sociogram;
