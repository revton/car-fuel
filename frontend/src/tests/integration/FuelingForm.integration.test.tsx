import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { FuelingForm } from '../../pages/Fuelings/FuelingForm';
import { apiClient } from '../../shared/api/apiClient';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../shared/api/apiClient', () => ({
    apiClient: {
        getVehicles: vi.fn(),
        getTanks: vi.fn(),
        createFueling: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('FuelingForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads vehicles and tanks on mount', async () => {
        const mockVehicles = [{ id: 'v1', name: 'Car 1' }];
        const mockTanks = [{ id: 't1', name: 'Tank 1' }];

        (apiClient.getVehicles as Mock).mockResolvedValue(mockVehicles);
        (apiClient.getTanks as Mock).mockResolvedValue(mockTanks);

        render(
            <MemoryRouter>
                <FuelingForm />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(apiClient.getVehicles).toHaveBeenCalled();
            expect(apiClient.getTanks).toHaveBeenCalledWith('v1');
        });
    });

    it('selects primary tank by default', async () => {
        const mockVehicles = [{ id: 'v1', name: 'Car 1' }];
        const mockTanks = [
            { id: 't1', name: 'Secondary Tank', isPrimary: false, fuelType: 'gasoline' },
            { id: 't2', name: 'Primary Tank', isPrimary: true, fuelType: 'ethanol' }
        ];

        (apiClient.getVehicles as Mock).mockResolvedValue(mockVehicles);
        (apiClient.getTanks as Mock).mockResolvedValue(mockTanks);

        render(
            <MemoryRouter>
                <FuelingForm />
            </MemoryRouter>
        );

        await waitFor(() => {
            const tankSelect = screen.getByLabelText(/^Tank$/i) as HTMLSelectElement;
            expect(tankSelect.value).toBe('t2');
            expect(screen.getByText('Primary Tank (ethanol)')).toBeInTheDocument();
        });
    });

    it('calculates total cost', async () => {
        const user = userEvent.setup();
        (apiClient.getVehicles as Mock).mockResolvedValue([]);
        (apiClient.getTanks as Mock).mockResolvedValue([]);

        render(
            <MemoryRouter>
                <FuelingForm />
            </MemoryRouter>
        );

        const volumeInput = await screen.findByLabelText(/Volume \(Liters\)/i);
        const priceInput = await screen.findByLabelText(/Price \/ Liter/i);

        await user.type(volumeInput, '50');
        await user.type(priceInput, '2');

        // screen.debug(); // Inspect DOM

        await waitFor(() => {
            const costInput = screen.getByLabelText(/Total Cost/i) as HTMLInputElement;
            expect(costInput.value).toBe('100');
        });
    });

    it('submits form', async () => {
        const user = userEvent.setup();
        const mockVehicles = [{ id: 'v1', name: 'Car 1' }];
        const mockTanks = [{ id: 't1', name: 'Tank 1', isPrimary: true, fuelType: 'gasoline' }];

        (apiClient.getVehicles as Mock).mockResolvedValue(mockVehicles);
        (apiClient.getTanks as Mock).mockResolvedValue(mockTanks);
        (apiClient.createFueling as Mock).mockResolvedValue({});

        render(
            <MemoryRouter>
                <FuelingForm />
            </MemoryRouter>
        );

        await screen.findByDisplayValue(/Car 1/);

        // Wait for tank to be loaded and selected
        await waitFor(() => {
            expect(apiClient.getTanks).toHaveBeenCalledWith('v1');
            // Expect the formatted display text
            expect(screen.getByText('Tank 1 (gasoline)')).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/Volume/i), '50');
        await user.type(screen.getByLabelText(/Price/i), '2');
        await user.type(screen.getByLabelText(/Odometer/i), '1000');

        const submitButton = screen.getByRole('button', { name: /Save Fueling/i });
        expect(submitButton).not.toBeDisabled();

        await user.click(submitButton);

        await waitFor(() => {
            expect(apiClient.createFueling).toHaveBeenCalledWith({
                tankId: 't1',
                filledAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/), // Expect ISO 8601 format
                odometer: 1000,
                volumeLiters: 50,
                totalCost: 100,
                fullTank: true, // Default is true
                note: ''
            });
            expect(mockNavigate).toHaveBeenCalledWith('/fuelings');
        });
    });
});
