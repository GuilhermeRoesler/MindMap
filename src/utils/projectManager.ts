import { type Node, type Edge } from '@xyflow/react';
import { initialNodes } from '../data/nodes';
import { initialEdges } from '../data/edges';
import apiRequest from './api';

export interface Project {
    id: number;
    name: string;
    nodes: Node[];
    edges: Edge[];
    updatedAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
    try {
        const projects = await apiRequest<Project[]>('projects.php');
        return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
};

export const createProject = async (name: string): Promise<Project> => {
    const newProjectData = {
        name,
        nodes: initialNodes,
        edges: initialEdges,
    };
    
    try {
        const newProject = await apiRequest<Project>('projects.php', {
            method: 'POST',
            body: JSON.stringify(newProjectData),
        });
        return newProject;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
};

export const getProject = async (id: number): Promise<Project | null> => {
    try {
        const project = await apiRequest<Project>(`projects.php?id=${id}`);
        return project;
    } catch (error) {
        console.error(`Failed to fetch project ${id}:`, error);
        return null;
    }
};

export const saveProject = async (projectToSave: Project): Promise<void> => {
    try {
        await apiRequest(`projects.php?id=${projectToSave.id}`, {
            method: 'POST',
            body: JSON.stringify({
                _method: 'PUT',
                name: projectToSave.name,
                nodes: projectToSave.nodes,
                edges: projectToSave.edges,
            }),
        });
    } catch (error) {
        console.error("Failed to save project:", error);
        throw error;
    }
};

export const deleteProject = async (id: number): Promise<void> => {
    try {
        await apiRequest(`projects.php?id=${id}`, {
            method: 'POST',
            body: JSON.stringify({
                _method: 'DELETE',
            }),
        });
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
};