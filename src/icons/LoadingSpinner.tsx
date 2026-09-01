import React from 'react';

interface LoadingSpinnerProps {
    size?: string;
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'h-8 w-8', color = 'border-indigo-500' }) => {
    return (
        <div className={`${size} animate-spin rounded-full border-4 border-t-transparent ${color}`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;