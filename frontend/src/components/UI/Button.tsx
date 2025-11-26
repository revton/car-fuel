import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    return (
        <button className={`btn btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
};
