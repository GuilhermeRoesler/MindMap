import { type Node, type Edge } from '@xyflow/react';
import { ulid } from 'ulid';
import { initialNodes } from '../data/nodes';
import { initialEdges } from '../data/edges';

export interface Project {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
    updatedAt: string;
}

const PROJECTS_KEY = 'mindmap_projects';

// Função para migrar dados antigos do localStorage para o novo formato de projetos
const migrateOldData = (): void => {
    const oldNodes = localStorage.getItem('nodes');
    const oldEdges = localStorage.getItem('edges');

    if (oldNodes) {
        try {
            const parsedNodes = JSON.parse(oldNodes);
            const parsedEdges = oldEdges ? JSON.parse(oldEdges) : [];

            const migratedProject: Project = {
                id: ulid(),
                name: 'My First Mind Map',
                nodes: parsedNodes,
                edges: parsedEdges,
                updatedAt: new Date().toISOString(),
            };

            saveProjects([migratedProject]);

            localStorage.removeItem('nodes');
            localStorage.removeItem('edges');
        } catch (error) {
            console.error("Failed to migrate old data:", error);
            localStorage.removeItem('nodes');
            localStorage.removeItem('edges');
        }
    }
};


export const getProjects = (): Project[] => {
    // Verifica se existem dados antigos para migrar
    if (localStorage.getItem('nodes')) {
        migrateOldData();
    }

    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    if (!projectsJson) {
        return [];
    }
    try {
        const projects = JSON.parse(projectsJson) as Project[];
        // Ordena por data de atualização, do mais recente para o mais antigo
        return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
        console.error("Failed to parse projects from localStorage:", error);
        return [];
    }
};

export const saveProjects = (projects: Project[]): void => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const createProject = (name: string): Project => {
    const newProject: Project = {
        id: ulid(),
        name,
        nodes: initialNodes,
        edges: initialEdges,
        updatedAt: new Date().toISOString(),
    };

    const projects = getProjects();
    saveProjects([newProject, ...projects]);
    return newProject;
};

export const getProject = (id: string): Project | null => {
    const projects = getProjects();
    return projects.find(p => p.id === id) || null;
};

export const saveProject = (projectToSave: Project): void => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectToSave.id);

    const updatedProject = {
        ...projectToSave,
        updatedAt: new Date().toISOString(),
    };

    if (projectIndex > -1) {
        projects[projectIndex] = updatedProject;
    } else {
        projects.push(updatedProject);
    }
    saveProjects(projects);
};


export const deleteProject = (id: string): void => {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    saveProjects(filteredProjects);
};