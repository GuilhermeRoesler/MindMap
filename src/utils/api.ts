import { useGlobalConfigStore } from '../store/globalConfigStore';

const API_BASE_URL = 'https://mind-map.fwh.is/api/';
// const API_BASE_URL = 'http://localhost:8000/';

interface RequestOptions extends RequestInit {
    // You can add custom options here if needed
}

const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { authToken } = useGlobalConfigStore.getState();

    const headers = new Headers(options.headers || {});
    headers.append('Content-Type', 'application/json');
    if (authToken) {
        headers.append('Authorization', `Bearer ${authToken}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null as T;
        }

        return await response.json() as T;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

export default apiRequest;