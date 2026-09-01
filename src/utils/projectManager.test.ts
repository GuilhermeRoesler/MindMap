import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Node, type Edge } from '@xyflow/react';
import {
    getProjects,
    createProject,
    getProject,
    updateProjectData,
    renameProject,
    deleteProject,
    exportProjects,
    importProjects,
} from './projectManager';
import { DEMO_PROJECT_ID, DEMO_PROJECT_NAME } from '../data/demoProject';

const STORAGE_KEY = 'mindmap_projects';

describe('projectManager (localStorage)', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('seeds demo project on first access', async () => {
        const projects = await getProjects();

        expect(projects).toHaveLength(1);
        expect(projects[0].id).toBe(DEMO_PROJECT_ID);
        expect(projects[0].name).toBe(DEMO_PROJECT_NAME);
        expect(projects[0].isDemo).toBe(true);
        expect(projects[0].nodes.length).toBeGreaterThan(1);
    });

    it('creates a new project with initial nodes', async () => {
        await getProjects();
        const created = await createProject('My Project');

        expect(created.name).toBe('My Project');
        expect(created.nodes).toHaveLength(1);
        expect(created.nodes[0].id).toBe('root');

        const projects = await getProjects();
        expect(projects).toHaveLength(2);
    });

    it('reads a project by id', async () => {
        await getProjects();
        const created = await createProject('Test Map');
        const fetched = await getProject(created.id);

        expect(fetched?.name).toBe('Test Map');
    });

    it('updates project nodes and edges', async () => {
        await getProjects();
        const created = await createProject('Editable');

        const newNodes: Node[] = [
            {
                id: 'root',
                type: 'interactive',
                data: { label: 'Updated' },
                position: { x: 0, y: 0 },
            },
        ];
        const newEdges: Edge[] = [];

        await updateProjectData(created.id, newNodes, newEdges);
        const updated = await getProject(created.id);

        expect(updated?.nodes[0].data?.label).toBe('Updated');
    });

    it('renames a project', async () => {
        await getProjects();
        const created = await createProject('Old Name');

        await renameProject(created.id, 'New Name');
        const renamed = await getProject(created.id);

        expect(renamed?.name).toBe('New Name');
    });

    it('deletes a non-demo project', async () => {
        await getProjects();
        const created = await createProject('To Delete');

        await deleteProject(created.id);
        const projects = await getProjects();

        expect(projects.find((p) => p.id === created.id)).toBeUndefined();
        expect(projects.find((p) => p.id === DEMO_PROJECT_ID)).toBeDefined();
    });

    it('prevents deleting the demo project', async () => {
        await getProjects();

        await expect(deleteProject(DEMO_PROJECT_ID)).rejects.toThrow(
            'The demo project cannot be deleted.',
        );
    });

    it('persists data in localStorage', async () => {
        await getProjects();
        await createProject('Persisted');

        const raw = localStorage.getItem(STORAGE_KEY);
        expect(raw).toBeTruthy();

        const parsed = JSON.parse(raw!) as { name: string }[];
        expect(parsed.some((p) => p.name === 'Persisted')).toBe(true);
    });

    it('exports projects as JSON', async () => {
        await getProjects();
        await createProject('Export Me');

        const json = exportProjects();
        const parsed = JSON.parse(json) as { name: string }[];

        expect(parsed.some((p) => p.name === 'Export Me')).toBe(true);
    });

    it('imports projects in merge mode', async () => {
        await getProjects();
        await createProject('Imported Project');
        const backup = exportProjects();
        localStorage.clear();

        const added = await importProjects(backup, 'merge');
        const projects = await getProjects();

        expect(added).toBe(1);
        expect(projects.some((p) => p.name === 'Imported Project')).toBe(true);
    });

    it('rejects invalid import JSON', async () => {
        await expect(importProjects('not json', 'merge')).rejects.toThrow('Invalid JSON file.');
    });
});
