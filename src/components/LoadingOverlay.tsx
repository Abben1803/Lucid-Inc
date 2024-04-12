import React, { useState, useEffect } from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
    isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        "Gathering your ideas...",
        "Talking to the story helper...",
        "Creating your adventure...",
        "Thinking up a fun title...",
        "Drawing cool pictures...",
        "Putting your book together...",
        "Almost done...",
        "Just a few more seconds...",
        "Finishing up...",
        "All set!",
        "Opening your story book...",
    ];

    useEffect(() => {
        if (!isLoading) {
            setMessageIndex(0);  // Reset to the first message when not loading.
            return;
        }

        const interval = setInterval(() => {
            setMessageIndex((current) => {
                // Stop incrementing index if it's the last message.
                return current === messages.length - 1 ? current : current + 1;
            });
        }, 5000); // Change message every 5 seconds

        // Clear interval on cleanup
        return () => clearInterval(interval);
    }, [isLoading, messages.length]);

    if (!isLoading) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.loader}></div>
            <div className={styles.message}>{messages[messageIndex]}</div>
        </div>
    );
};

export default LoadingOverlay;
