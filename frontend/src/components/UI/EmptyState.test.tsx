import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
    it('renders title and description', () => {
        render(
            <EmptyState
                title="No Data"
                description="Please add some data."
            />
        );
        expect(screen.getByText('No Data')).toBeInTheDocument();
        expect(screen.getByText('Please add some data.')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
        render(
            <EmptyState
                title="No Data"
                description="Desc"
                icon={<span data-testid="icon">🚀</span>}
            />
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders action button and handles click', () => {
        const handleAction = vi.fn();
        render(
            <EmptyState
                title="No Data"
                description="Desc"
                actionLabel="Add Item"
                onAction={handleAction}
            />
        );

        const button = screen.getByText('Add Item');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleAction).toHaveBeenCalledTimes(1);
    });
});
