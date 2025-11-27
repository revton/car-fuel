import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from '../../pages/HomePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as HealthContextModule from '../../shared/context/HealthContext';

// Mock useHealth hook
vi.mock('../../shared/context/HealthContext', async () => {
    const actual = await vi.importActual('../../shared/context/HealthContext');
    return {
        ...actual,
        useHealth: vi.fn(),
    };
});

describe('HomePage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('navigates to vehicle form when Add Vehicle is clicked', async () => {
        const user = userEvent.setup();
        (HealthContextModule.useHealth as any).mockReturnValue({
            health: { status: 'ok' },
            error: null,
            loading: false,
            isOnline: true,
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/vehicles/new" element={<div>New Vehicle Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        const addVehicleLink = screen.getByRole('link', { name: /Add Vehicle/i });
        await user.click(addVehicleLink);

        expect(screen.getByText('New Vehicle Page')).toBeInTheDocument();
    });
});
