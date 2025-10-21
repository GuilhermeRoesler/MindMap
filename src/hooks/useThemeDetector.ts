import { useState, useEffect } from 'react';

export const useThemeDetector = () => {
    const getCurrentTheme = () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const mqListener = (e: MediaQueryListEvent) => {
            setIsDarkTheme(e.matches);
        };

        mediaQuery.addEventListener('change', mqListener);

        return () => {
            mediaQuery.removeEventListener('change', mqListener);
        };
    }, []);

    return isDarkTheme;
};