import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { VehicleList } from '../../pages/Vehicles/VehicleList';
import { apiClient } from '../../shared/api/apiClient';
import { MemoryRouter } from 'react-router-dom';

// Mock apiClient
vi.mock('../../shared/api/apiClient', () => ({
    apiClient: {
        getVehicles: vi.fn(),
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

describe('VehicleList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (apiClient.getVehicles as Mock).mockReturnValue(new Promise(() => { })); // Never resolves
        render(
            <MemoryRouter>
                <VehicleList />
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty state when no vehicles', async () => {
        (apiClient.getVehicles as Mock).mockResolvedValue([]);
        render(
            <MemoryRouter>
                <VehicleList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No Vehicles Found')).toBeInTheDocument();
        });
    });

    it('renders list of vehicles', async () => {
        const mockVehicles = [
            { id: '1', name: 'Car 1', plate: 'ABC-1234', odometerUnit: 'km' },
            { id: '2', name: 'Car 2', plate: 'XYZ-9876', odometerUnit: 'mi' },
        ];
        (apiClient.getVehicles as Mock).mockResolvedValue(mockVehicles);

        render(
            <MemoryRouter>
                <VehicleList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Car 1')).toBeInTheDocument();
            expect(screen.getByText('Car 2')).toBeInTheDocument();
        });
    });

    it('navigates to new vehicle page on button click', async () => {
        (apiClient.getVehicles as Mock).mockResolvedValue([]);
        render(
            <MemoryRouter>
                <VehicleList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('+ Add Vehicle')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('+ Add Vehicle'));
        expect(mockNavigate).toHaveBeenCalledWith('/vehicles/new');
    });
});
