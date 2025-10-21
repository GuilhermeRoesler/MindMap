import { useState, useRef, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

interface UseNodeEditorProps {
    id: string;
    initialLabel: string;
    isInitiallyEditing?: boolean;
}

export const useNodeEditor = ({ id, initialLabel, isInitiallyEditing = false }: UseNodeEditorProps) => {
    const [isEditing, setIsEditing] = useState(isInitiallyEditing);
    const contentRef = useRef<HTMLParagraphElement>(null);
    const { setNodes } = useReactFlow();

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const saveEdit = useCallback(() => {
        const newValue = contentRef.current?.textContent || '';
        if (newValue.trim() !== '') {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id
                        ? { ...node, data: { ...node.data, label: newValue.trim(), isEditing: false } }
                        : node
                )
            );
        }
        setIsEditing(false);
    }, [id, setNodes]);

    const cancelEdit = useCallback(() => {
        if (contentRef.current) {
            contentRef.current.textContent = initialLabel;
        }
        setIsEditing(false);
    }, [initialLabel]);

    return {
        isEditing,
        contentRef,
        startEditing,
        saveEdit,
        cancelEdit
    };
};