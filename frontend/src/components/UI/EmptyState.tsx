import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    actionLabel,
    onAction
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-8)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--glass-border)'
        }}>
            {icon && (
                <div style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--spacing-4)',
                    opacity: 0.8
                }}>
                    {icon}
                </div>
            )}
            <h3 style={{
                margin: '0 0 var(--spacing-2) 0',
                color: 'var(--color-text)',
                fontSize: '1.2rem'
            }}>
                {title}
            </h3>
            <p style={{
                margin: '0 0 var(--spacing-6) 0',
                maxWidth: '400px'
            }}>
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
