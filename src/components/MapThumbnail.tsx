import type { Edge, Node } from '@xyflow/react';
import { buildThumbnailLayout, curvedPath } from '@/utils/mapGeometry';
import { cn } from '@/lib/utils';

interface MapThumbnailProps {
    nodes: Node[];
    edges: Edge[];
    className?: string;
    animated?: boolean;
    showLabels?: boolean;
}

const MapThumbnail = ({
    nodes,
    edges,
    className,
    animated = false,
    showLabels = false,
}: MapThumbnailProps) => {
    const layout = buildThumbnailLayout(nodes, edges, 320, 180, animated ? 28 : 20);

    if (layout.nodes.length === 0) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted/40 text-xs text-muted-foreground',
                    className,
                )}
            >
                Empty map
            </div>
        );
    }

    return (
        <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className={cn('h-full w-full', className)}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="thumb-glow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width={layout.width} height={layout.height} fill="url(#thumb-glow)" />
            {layout.edges.map((edge, i) => (
                <path
                    key={edge.id}
                    d={curvedPath(edge.x1, edge.y1, edge.x2, edge.y2)}
                    fill="none"
                    stroke={edge.color}
                    strokeWidth={animated ? 2.2 : 1.6}
                    strokeLinecap="round"
                    className={animated ? 'thumb-edge-draw' : undefined}
                    style={animated ? { animationDelay: `${i * 60}ms` } : undefined}
                />
            ))}
            {layout.nodes.map((node, i) => (
                <g
                    key={node.id}
                    className={animated ? 'thumb-node-appear' : undefined}
                    style={animated ? { animationDelay: `${80 + i * 45}ms` } : undefined}
                >
                    <rect
                        x={node.x}
                        y={node.y}
                        width={node.w}
                        height={node.h}
                        rx={Math.min(8, node.h / 3)}
                        fill="var(--card)"
                        stroke={node.isRoot ? 'var(--primary)' : node.accent}
                        strokeWidth={node.isRoot ? 2 : 1.5}
                    />
                    <rect
                        x={node.x}
                        y={node.y + 2}
                        width={3}
                        height={node.h - 4}
                        rx={1.5}
                        fill={node.accent}
                        opacity={node.isRoot ? 0 : 0.9}
                    />
                    {showLabels && node.w > 36 && (
                        <text
                            x={node.x + node.w / 2}
                            y={node.y + node.h / 2 + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="var(--card-foreground)"
                            fontSize={Math.max(6, Math.min(9, node.h * 0.35))}
                            fontWeight={node.isRoot ? 600 : 500}
                            className="select-none"
                        >
                            {node.label.length > 18 ? `${node.label.slice(0, 16)}…` : node.label}
                        </text>
                    )}
                </g>
            ))}
        </svg>
    );
};

export default MapThumbnail;
