import React, { useEffect, useRef, useState } from 'react';
import { SociometricNode, SociometricEdge, SocialCluster } from '../../services/bullsAnalysisService';

interface SociogramChartProps {
  nodes: SociometricNode[];
  edges: SociometricEdge[];
  clusters: SocialCluster[];
  width?: number;
  height?: number;
  onNodeClick?: (node: SociometricNode) => void;
}

interface Position {
  x: number;
  y: number;
}

interface NodeWithPosition extends SociometricNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

const SociogramChart: React.FC<SociogramChartProps> = ({
  nodes,
  edges,
  clusters,
  width = 800,
  height = 600,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodesWithPositions, setNodesWithPositions] = useState<NodeWithPosition[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize node positions using force-directed layout simulation
  useEffect(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Simple force-directed layout
    const initialNodes: NodeWithPosition[] = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3;
      
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      };
    });

    // Run simple force simulation
    const simulate = () => {
      const alpha = 0.1;
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        // Repulsion force between nodes
        initialNodes.forEach((nodeA, indexA) => {
          initialNodes.forEach((nodeB, indexB) => {
            if (indexA === indexB) return;
            
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const force = (100 - distance) * 0.01;
              const angle = Math.atan2(dy, dx);
              
              nodeA.vx! -= Math.cos(angle) * force;
              nodeA.vy! -= Math.sin(angle) * force;
              nodeB.vx! += Math.cos(angle) * force;
              nodeB.vy! += Math.sin(angle) * force;
            }
          });
        });

        // Attraction force for connected nodes
        edges.forEach(edge => {
          const sourceNode = initialNodes.find(n => n.id === edge.source);
          const targetNode = initialNodes.find(n => n.id === edge.target);
          
          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const idealDistance = edge.type === 'positive' ? 80 : 120;
            const force = (distance - idealDistance) * 0.001 * Math.abs(edge.weight);
            const angle = Math.atan2(dy, dx);
            
            sourceNode.vx! += Math.cos(angle) * force;
            sourceNode.vy! += Math.sin(angle) * force;
            targetNode.vx! -= Math.cos(angle) * force;
            targetNode.vy! -= Math.sin(angle) * force;
          }
        });

        // Apply velocity and damping
        initialNodes.forEach(node => {
          node.x += node.vx! * alpha;
          node.y += node.vy! * alpha;
          node.vx! *= 0.9;
          node.vy! *= 0.9;
          
          // Keep nodes within bounds
          node.x = Math.max(30, Math.min(width - 30, node.x));
          node.y = Math.max(30, Math.min(height - 30, node.y));
        });
      }
    };

    simulate();
    setNodesWithPositions(initialNodes);
  }, [nodes, edges, width, height]);

  const getNodeColor = (node: SociometricNode): string => {
    switch (node.socialStatus) {
      case 'popular': return '#10B981'; // Green
      case 'rejected': return '#EF4444'; // Red
      case 'isolated': return '#6B7280'; // Gray
      case 'controversial': return '#F59E0B'; // Orange
      default: return '#3B82F6'; // Blue
    }
  };

  const getNodeSize = (node: SociometricNode): number => {
    const baseSize = 8;
    const popularityBonus = Math.min(node.popularityScore * 2, 12);
    return baseSize + popularityBonus;
  };

  const getEdgeColor = (edge: SociometricEdge): string => {
    switch (edge.type) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getEdgeWidth = (edge: SociometricEdge): number => {
    return Math.max(1, Math.abs(edge.weight) * 0.5);
  };

  const getEdgeOpacity = (edge: SociometricEdge): number => {
    if (selectedNode) {
      return edge.source === selectedNode || edge.target === selectedNode ? 0.8 : 0.2;
    }
    return edge.reciprocal ? 0.8 : 0.5;
  };

  const handleNodeClick = (node: SociometricNode) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
    onNodeClick?.(node);
  };

  const renderClusterBackground = (cluster: SocialCluster) => {
    const clusterNodes = nodesWithPositions.filter(n => cluster.members.includes(n.id));
    if (clusterNodes.length < 3) return null;

    // Calculate convex hull for cluster background
    const points = clusterNodes.map(n => ({ x: n.x, y: n.y }));
    const hull = calculateConvexHull(points);
    const pathData = hull.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <path
        key={cluster.id}
        d={pathData}
        fill={`hsl(${cluster.members.length * 30}, 30%, 95%)`}
        stroke={`hsl(${cluster.members.length * 30}, 50%, 70%)`}
        strokeWidth="1"
        strokeDasharray="5,5"
        opacity="0.3"
      />
    );
  };

  const calculateConvexHull = (points: Position[]): Position[] => {
    // Simple convex hull algorithm (Graham scan simplified)
    if (points.length < 3) return points;
    
    // Find the bottom-most point
    let bottom = points[0];
    points.forEach(p => {
      if (p.y > bottom.y || (p.y === bottom.y && p.x < bottom.x)) {
        bottom = p;
      }
    });

    // Sort points by polar angle with respect to bottom point
    const sorted = points
      .filter(p => p !== bottom)
      .sort((a, b) => {
        const angleA = Math.atan2(a.y - bottom.y, a.x - bottom.x);
        const angleB = Math.atan2(b.y - bottom.y, b.x - bottom.x);
        return angleA - angleB;
      });

    // Build convex hull
    const hull = [bottom];
    sorted.forEach(point => {
      while (hull.length > 1) {
        const p1 = hull[hull.length - 2];
        const p2 = hull[hull.length - 1];
        const cross = (p2.x - p1.x) * (point.y - p1.y) - (p2.y - p1.y) * (point.x - p1.x);
        if (cross > 0) break;
        hull.pop();
      }
      hull.push(point);
    });

    // Expand hull slightly for better visualization
    const center = hull.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    center.x /= hull.length;
    center.y /= hull.length;

    return hull.map(p => ({
      x: center.x + (p.x - center.x) * 1.2,
      y: center.y + (p.y - center.y) * 1.2
    }));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
      >
        {/* Cluster backgrounds */}
        <g className="clusters">
          {clusters.map(renderClusterBackground)}
        </g>

        {/* Edges */}
        <g className="edges">
          {edges.map((edge, index) => {
            const sourceNode = nodesWithPositions.find(n => n.id === edge.source);
            const targetNode = nodesWithPositions.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={`${edge.source}-${edge.target}-${index}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={getEdgeWidth(edge)}
                  opacity={getEdgeOpacity(edge)}
                  strokeDasharray={edge.reciprocal ? 'none' : '3,3'}
                />
                {edge.reciprocal && (
                  <circle
                    cx={(sourceNode.x + targetNode.x) / 2}
                    cy={(sourceNode.y + targetNode.y) / 2}
                    r="2"
                    fill={getEdgeColor(edge)}
                    opacity={getEdgeOpacity(edge)}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodesWithPositions.map(node => (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={getNodeSize(node)}
                fill={getNodeColor(node)}
                stroke={selectedNode === node.id ? '#1F2937' : '#FFFFFF'}
                strokeWidth={selectedNode === node.id ? 3 : 2}
                opacity={selectedNode && selectedNode !== node.id ? 0.6 : 1}
                className="cursor-pointer hover:stroke-gray-800 transition-all"
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              {/* Risk indicators */}
              {(node.bullyingRisk === 'high' || node.victimizationRisk === 'high') && (
                <circle
                  cx={node.x + getNodeSize(node) - 2}
                  cy={node.y - getNodeSize(node) + 2}
                  r="4"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}
              
              {/* Node label */}
              {(hoveredNode === node.id || selectedNode === node.id) && (
                <text
                  x={node.x}
                  y={node.y + getNodeSize(node) + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  className="font-medium"
                >
                  {node.name}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-semibold text-sm mb-3">Leyenda</h3>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Popular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Rechazado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Aislado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Controvertido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Promedio</span>
          </div>
        </div>

        <hr className="my-3" />

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span>Relación positiva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span>Relación negativa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <div className="w-1 h-1 rounded-full bg-green-500"></div>
            <span>Recíproca</span>
          </div>
        </div>

        <hr className="my-3" />

        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-500 relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <span>Alto riesgo</span>
        </div>
      </div>

      {/* Node details panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;

            return (
              <div>
                <h3 className="font-semibold text-sm mb-2">{node.fullName}</h3>
                <div className="space-y-1 text-xs">
                  <div>Edad: {node.age} años</div>
                  <div>Estatus: {node.socialStatus}</div>
                  <div>Popularidad: {node.popularityScore}</div>
                  <div>Rechazo: {node.rejectionScore}</div>
                  <div>Aislamiento: {node.isolationLevel}</div>
                  <div>Riesgo bullying: {node.bullyingRisk}</div>
                  <div>Riesgo victimización: {node.victimizationRisk}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SociogramChart;