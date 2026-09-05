interface MindMapIconProps {
    size?: number;
    withBackground?: boolean;
    className?: string;
}

const MindMapIcon = ({ size = 20, withBackground = false, className }: MindMapIconProps) => {
    if (withBackground) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                aria-hidden="true"
            >
                <rect width="32" height="32" rx="7" fill="#0f766e" />
                <path
                    d="M16 11v2M16 19v2M11 16h2M19 16h2M13.5 13.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 13.5l-1.4 1.4M14.9 17.1l-1.4 1.4"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <circle cx="16" cy="16" r="3.2" fill="white" />
                <circle cx="16" cy="8.5" r="2" fill="white" />
                <circle cx="23.5" cy="12.5" r="2" fill="white" />
                <circle cx="21.5" cy="21.5" r="2" fill="white" />
                <circle cx="10.5" cy="21.5" r="2" fill="white" />
                <circle cx="8.5" cy="12.5" r="2" fill="white" />
            </svg>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M12 8.5v1.5M12 14v1.5M8.5 12h1.5M14 12h1.5M10.1 10.1l1.1 1.1M12.9 12.9l1.1 1.1M13.9 10.1l-1.1 1.1M11.1 12.9l-1.1 1.1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="2.4" fill="currentColor" />
            <circle cx="12" cy="5.5" r="1.5" fill="currentColor" />
            <circle cx="17.5" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16.5" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16.5" r="1.5" fill="currentColor" />
            <circle cx="6.5" cy="8.5" r="1.5" fill="currentColor" />
        </svg>
    );
};

export default MindMapIcon;
