import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { FuelingList } from '../../pages/Fuelings/FuelingList';
import { apiClient } from '../../shared/api/apiClient';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../shared/api/apiClient', () => ({
    apiClient: {
        getFuelings: vi.fn(),
        getVehicles: vi.fn(),
        getTanks: vi.fn(),
    },
}));

describe('FuelingList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementations to avoid crashes
        (apiClient.getVehicles as Mock).mockResolvedValue([]);
        (apiClient.getTanks as Mock).mockResolvedValue([]);
    });

    it('renders empty state when no fuelings', async () => {
        (apiClient.getFuelings as Mock).mockResolvedValue([]);
        render(
            <MemoryRouter>
                <FuelingList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No Fuelings Recorded')).toBeInTheDocument();
        });
    });

    it('renders list of fuelings', async () => {
        const mockFuelings = [
            {
                id: '1',
                tankId: 'tank1',
                filledAt: '2023-01-01T10:00:00Z',
                volumeLiters: 50,
                totalCost: 100,
                odometer: 1000,
                note: 'Test Note'
            }
        ];
        const mockVehicles = [
            { id: 'v1', name: 'Test Car' }
        ];
        const mockTanks = [
            { id: 'tank1', name: 'Main Tank', vehicleId: 'v1' }
        ];

        (apiClient.getFuelings as Mock).mockResolvedValue(mockFuelings);
        (apiClient.getVehicles as Mock).mockResolvedValue(mockVehicles);
        (apiClient.getTanks as Mock).mockResolvedValue(mockTanks);

        render(
            <MemoryRouter>
                <FuelingList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Test Note/)).toBeInTheDocument();
            expect(screen.getByText(/\$100.00/)).toBeInTheDocument();
            expect(screen.getByText(/Test Car • Main Tank/)).toBeInTheDocument();
        });
    });
});
