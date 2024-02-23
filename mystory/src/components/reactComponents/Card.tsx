import React from 'react'
import styles from '../../styles/homepage.module.css'

interface CardProps {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className={styles.card}>{children}</div>
    );
}

export default Card;