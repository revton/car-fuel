import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card><div>Card Content</div></Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(<Card title="Card Title">Content</Card>);
        expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
