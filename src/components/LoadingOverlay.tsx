import React from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
    isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.loader}></div>
        </div>
    );
};

export default LoadingOverlay;