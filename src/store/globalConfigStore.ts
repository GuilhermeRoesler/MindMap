import { create } from 'zustand';

interface GlobalConfigState {
    authToken: string | null;
    setAuthToken: (token: string | null) => void;
}

export const useGlobalConfigStore = create<GlobalConfigState>((set) => ({
    authToken: localStorage.getItem('authToken'),
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
        set({ authToken: token });
    },
}));