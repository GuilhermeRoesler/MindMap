import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'mindmap_theme';

interface ThemeContextValue {
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolveIsDark = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return getSystemDark();
};

const applyTheme = (mode: ThemeMode) => {
    const isDark = resolveIsDark(mode);
    document.documentElement.dataset.theme = mode;
    document.documentElement.classList.toggle('dark-theme', isDark);
};

const loadThemeMode = (): ThemeMode => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(loadThemeMode);
    const [isDark, setIsDark] = useState(() => resolveIsDark(loadThemeMode()));

    const setThemeMode = useCallback((mode: ThemeMode) => {
        localStorage.setItem(STORAGE_KEY, mode);
        setThemeModeState(mode);
        applyTheme(mode);
        setIsDark(resolveIsDark(mode));
    }, []);

    const cycleTheme = useCallback(() => {
        const order: ThemeMode[] = ['system', 'light', 'dark'];
        const next = order[(order.indexOf(themeMode) + 1) % order.length];
        setThemeMode(next);
    }, [themeMode, setThemeMode]);

    useEffect(() => {
        applyTheme(themeMode);

        if (themeMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
            applyTheme('system');
            setIsDark(resolveIsDark('system'));
        };
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, [themeMode]);

    return (
        <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook shares provider module
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

if (typeof document !== 'undefined') {
    applyTheme(loadThemeMode());
}
