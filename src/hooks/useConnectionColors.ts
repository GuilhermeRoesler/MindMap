import { useCallback } from "react";
import { useReactFlow, type Edge } from "@xyflow/react";
import { getConnectionColor } from "../utils/colorUtils";

export const useConnectionColors = () => {
    const { getEdges, setEdges } = useReactFlow();

    const updateConnectionColors = useCallback(() => {
        const edges = getEdges();

        // Group edges by parent AND by side
        const edgesByParentAndSide = edges.reduce((acc, edge) => {
            const key = `${edge.source}-${edge.targetHandle}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(edge);
            return acc;
        }, {} as Record<string, Edge[]>);

        // Update colors based on order per side
        const updatedEdges = edges.map(edge => {
            const key = `${edge.source}-${edge.targetHandle}`;
            const sideEdges = edgesByParentAndSide[key] || [];
            const sortedSideEdges = sideEdges.sort((a, b) => a.id.localeCompare(b.id));
            const childIndex = sortedSideEdges.findIndex(e => e.id === edge.id);
            const color = getConnectionColor(childIndex);

            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: color,
                },
                data: {
                    ...edge.data,
                    color: color,
                    childIndex: childIndex
                }
            };
        });

        setEdges(updatedEdges);

        // Update localStorage
        localStorage.setItem('edges', JSON.stringify(updatedEdges));
    }, [getEdges, setEdges]);

    return { updateConnectionColors };
}