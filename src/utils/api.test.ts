import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGlobalConfigStore } from '../store/globalConfigStore';
import apiRequest from './api';

const fetchMock = vi.fn();

describe('apiRequest', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
        useGlobalConfigStore.setState({ authToken: null, userEmail: null });
        fetchMock.mockReset();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('sends JSON content type and parses successful responses', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ id: 1, name: 'Test' }),
        });

        const result = await apiRequest<{ id: number; name: string }>('projects.php');

        expect(result).toEqual({ id: 1, name: 'Test' });
        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:8000/projects.php',
            expect.objectContaining({
                headers: expect.any(Headers),
            }),
        );

        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(headers.get('Authorization')).toBeNull();
    });

    it('includes authorization header when token is present', async () => {
        useGlobalConfigStore.setState({ authToken: 'secret-token' });

        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({}),
        });

        await apiRequest('projects.php');

        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get('Authorization')).toBe('Bearer secret-token');
    });

    it('throws with server message on HTTP errors', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Unauthorized' }),
        });

        await expect(apiRequest('projects.php')).rejects.toThrow('Unauthorized');
    });

    it('returns null for 204 responses', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 204,
            json: async () => ({}),
        });

        const result = await apiRequest<null>('projects.php', { method: 'DELETE' });

        expect(result).toBeNull();
    });
});
