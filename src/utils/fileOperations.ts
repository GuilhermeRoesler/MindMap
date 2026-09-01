import type { Node, Edge } from '@xyflow/react';

export interface MindMapData {
    nodes: Node[];
    edges: Edge[];
}

export const exportMindMap = async (nodes: Node[], edges: Edge[]): Promise<void> => {
    const data: MindMapData = { nodes, edges };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });

    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: nodes[0].data.label,
            types: [
                {
                    description: 'JSON File',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
    } catch (err) {
        console.error('Export operation canceled or failed:', err);
        throw err;
    }
};

export const importMindMap = async (): Promise<MindMapData> => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'JSON File',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
        });

        const file = await fileHandle.getFile();
        const contents = await file.text();
        const data = JSON.parse(contents) as MindMapData;

        // Basic validation
        if (!data.nodes || !data.edges) {
            throw new Error('Invalid file format');
        }

        return data;
    } catch (err) {
        console.error('Import operation canceled or failed:', err);
        throw err;
    }
};