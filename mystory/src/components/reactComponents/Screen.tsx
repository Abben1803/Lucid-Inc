import React from 'react'
import styles from '../../styles/homepage.module.css'

interface ScreenProps {
    children: React.ReactNode;
}


export const Screen: React.FC<ScreenProps>= ({ children }) => {
    return (
        <div className={styles.screen}>{children}</div>
    );
}


export default Screen;
