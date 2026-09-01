import { create } from 'zustand';

interface GlobalConfigState {
    authToken: string | null;
    userEmail: string | null;
    setAuthToken: (token: string | null) => void;
    setUserEmail: (email: string | null) => void;
}

export const useGlobalConfigStore = create<GlobalConfigState>((set) => ({
    authToken: localStorage.getItem('authToken'),
    userEmail: localStorage.getItem('userEmail'),
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            set({ authToken: null, userEmail: null });
            return;
        }
        set({ authToken: token });
    },
    setUserEmail: (email) => {
        if (email) {
            localStorage.setItem('userEmail', email);
        } else {
            localStorage.removeItem('userEmail');
        }
        set({ userEmail: email });
    },
}));

export const getDisplayName = (email: string | null): string => {
    if (!email) return 'User';
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
};
