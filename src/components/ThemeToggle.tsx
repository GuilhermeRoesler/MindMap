import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme, type ThemeMode } from '../hooks/useTheme';

const labels: Record<ThemeMode, string> = {
    system: 'System theme',
    light: 'Light theme',
    dark: 'Dark theme',
};

const icons: Record<ThemeMode, typeof Sun> = {
    system: Monitor,
    light: Sun,
    dark: Moon,
};

interface ThemeToggleProps {
    compact?: boolean;
}

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
    const { themeMode, cycleTheme } = useTheme();
    const Icon = icons[themeMode];

    return (
        <button
            type="button"
            className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
            onClick={cycleTheme}
            title={labels[themeMode]}
            aria-label={labels[themeMode]}
        >
            <Icon size={18} />
            {!compact && <span>{labels[themeMode]}</span>}
        </button>
    );
};

export default ThemeToggle;
