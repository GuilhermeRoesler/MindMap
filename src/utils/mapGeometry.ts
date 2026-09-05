import type { Edge, Node } from '@xyflow/react';
import { BRAND_COLOR } from '../constants';

const NODE_W = 160;
const NODE_H = 40;

export interface ThumbnailPoint {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    isRoot: boolean;
    accent: string;
}

export interface ThumbnailEdge {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
}

export interface ThumbnailLayout {
    width: number;
    height: number;
    nodes: ThumbnailPoint[];
    edges: ThumbnailEdge[];
}

function getAccentForNode(nodeId: string, edges: Edge[]): string {
    const incoming = edges.find((e) => e.target === nodeId);
    if (!incoming) return BRAND_COLOR;
    const fromData = (incoming.data as { color?: string } | undefined)?.color;
    if (typeof fromData === 'string') return fromData;
    if (typeof incoming.style?.stroke === 'string') return incoming.style.stroke;
    return BRAND_COLOR;
}

function isRootNode(node: Node): boolean {
    const parentId = (node.data as { parentId?: string } | undefined)?.parentId;
    return !parentId || node.id === 'root' || node.id === 'demo-root';
}

/** Build a scaled SVG-friendly layout from React Flow nodes/edges. */
export function buildThumbnailLayout(
    nodes: Node[],
    edges: Edge[],
    viewWidth = 320,
    viewHeight = 180,
    padding = 24,
): ThumbnailLayout {
    if (nodes.length === 0) {
        return { width: viewWidth, height: viewHeight, nodes: [], edges: [] };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
        const x = node.position.x;
        const y = node.position.y;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + NODE_W);
        maxY = Math.max(maxY, y + NODE_H);
    }

    const contentW = Math.max(maxX - minX, 1);
    const contentH = Math.max(maxY - minY, 1);
    const scale = Math.min(
        (viewWidth - padding * 2) / contentW,
        (viewHeight - padding * 2) / contentH,
    );
    const offsetX = (viewWidth - contentW * scale) / 2;
    const offsetY = (viewHeight - contentH * scale) / 2;

    const projected = new Map<string, ThumbnailPoint>();

    for (const node of nodes) {
        const w = NODE_W * scale;
        const h = NODE_H * scale;
        const x = offsetX + (node.position.x - minX) * scale;
        const y = offsetY + (node.position.y - minY) * scale;
        projected.set(node.id, {
            id: node.id,
            x,
            y,
            w,
            h,
            label: String((node.data as { label?: string } | undefined)?.label ?? ''),
            isRoot: isRootNode(node),
            accent: getAccentForNode(node.id, edges),
        });
    }

    const thumbEdges: ThumbnailEdge[] = edges
        .map((edge) => {
            const source = projected.get(edge.source);
            const target = projected.get(edge.target);
            if (!source || !target) return null;
            const color =
                (edge.data as { color?: string } | undefined)?.color ??
                (typeof edge.style?.stroke === 'string' ? edge.style.stroke : BRAND_COLOR);
            return {
                id: edge.id,
                x1: source.x + source.w,
                y1: source.y + source.h / 2,
                x2: target.x,
                y2: target.y + target.h / 2,
                color,
            };
        })
        .filter((e): e is ThumbnailEdge => e !== null);

    return {
        width: viewWidth,
        height: viewHeight,
        nodes: [...projected.values()],
        edges: thumbEdges,
    };
}

export function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}
