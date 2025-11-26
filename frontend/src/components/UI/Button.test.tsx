import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles onClick event', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} disabled>Click me</Button>);

        const button = screen.getByText('Click me');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies variant classes', () => {
        const { container } = render(<Button variant="danger">Delete</Button>);
        expect(container.firstChild).toHaveClass('btn-danger');
    });
});
