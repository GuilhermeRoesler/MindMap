import { type Node, type Edge } from '@xyflow/react';
import { ulid } from 'ulid';
import { initialNodes } from '../data/nodes';
import { initialEdges } from '../data/edges';
import { DEMO_PROJECT_ID, DEMO_PROJECT_NAME, demoNodes, demoEdges } from '../data/demoProject';

const STORAGE_KEY = 'mindmap_projects';

export interface Project {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
    updatedAt: string;
    isDemo?: boolean;
}

const loadProjects = (): Project[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Project[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persistProjects = (projects: Project[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

const seedDemoProject = (): Project => ({
    id: DEMO_PROJECT_ID,
    name: DEMO_PROJECT_NAME,
    nodes: demoNodes,
    edges: demoEdges,
    updatedAt: new Date().toISOString(),
    isDemo: true,
});

const ensureInitialized = (): Project[] => {
    const projects = loadProjects();
    if (projects.length === 0) {
        const demo = seedDemoProject();
        persistProjects([demo]);
        return [demo];
    }
    return projects;
};

export const getProjects = async (): Promise<Project[]> => {
    const projects = ensureInitialized();
    return [...projects].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
};

export const createProject = async (name: string): Promise<Project> => {
    const newProject: Project = {
        id: ulid(),
        name,
        nodes: initialNodes,
        edges: initialEdges,
        updatedAt: new Date().toISOString(),
    };

    const projects = ensureInitialized();
    projects.unshift(newProject);
    persistProjects(projects);
    return newProject;
};

export const getProject = async (id: string): Promise<Project | null> => {
    const projects = ensureInitialized();
    return projects.find((p) => p.id === id) ?? null;
};

export const updateProjectData = async (
    id: string,
    nodes: Node[],
    edges: Edge[],
): Promise<void> => {
    const projects = ensureInitialized();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project ${id} not found`);

    projects[index] = {
        ...projects[index],
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
    };
    persistProjects(projects);
};

export const renameProject = async (id: string, name: string): Promise<void> => {
    const projects = ensureInitialized();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project ${id} not found`);

    projects[index] = {
        ...projects[index],
        name: name.trim(),
        updatedAt: new Date().toISOString(),
    };
    persistProjects(projects);
};

export const deleteProject = async (id: string): Promise<void> => {
    const projects = ensureInitialized();
    const project = projects.find((p) => p.id === id);
    if (project?.isDemo) {
        throw new Error('The demo project cannot be deleted.');
    }

    const filtered = projects.filter((p) => p.id !== id);
    persistProjects(filtered);
};

export const exportProjects = (): string => {
    const projects = ensureInitialized();
    return JSON.stringify(projects, null, 2);
};

const isValidProject = (value: unknown): value is Project => {
    if (!value || typeof value !== 'object') return false;
    const p = value as Project;
    return (
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        Array.isArray(p.nodes) &&
        Array.isArray(p.edges) &&
        typeof p.updatedAt === 'string'
    );
};

export const importProjects = async (json: string, mode: 'merge' | 'replace'): Promise<number> => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('Invalid JSON file.');
    }

    if (!Array.isArray(parsed)) {
        throw new Error('Expected an array of projects.');
    }

    const imported = parsed.filter(isValidProject);
    if (imported.length === 0) {
        throw new Error('No valid projects found in file.');
    }

    if (mode === 'replace') {
        const demo = seedDemoProject();
        const withoutDemo = imported.filter((p) => p.id !== DEMO_PROJECT_ID && !p.isDemo);
        persistProjects([demo, ...withoutDemo]);
        return withoutDemo.length;
    }

    const existing = ensureInitialized();
    const existingIds = new Set(existing.map((p) => p.id));
    let added = 0;

    for (const project of imported) {
        if (project.isDemo || project.id === DEMO_PROJECT_ID) continue;
        if (existingIds.has(project.id)) continue;
        existing.push(project);
        existingIds.add(project.id);
        added++;
    }

    persistProjects(existing);
    return added;
};
