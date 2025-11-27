import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleForm } from '../../pages/Vehicles/VehicleForm';
import { apiClient } from '../../shared/api/apiClient';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../shared/api/apiClient', () => ({
    apiClient: {
        getVehicle: vi.fn(),
        createVehicle: vi.fn(),
        createTank: vi.fn(),
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

describe('VehicleForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form elements', () => {
        render(
            <MemoryRouter>
                <VehicleForm />
            </MemoryRouter>
        );
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Plate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Odometer Unit/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fuel Type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Capacity/i)).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        (apiClient.createVehicle as any).mockResolvedValue({ id: 'v1' });
        (apiClient.createTank as any).mockResolvedValue({});

        render(
            <MemoryRouter>
                <VehicleForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Car' } });
        fireEvent.change(screen.getByLabelText(/Plate/i), { target: { value: 'ABC-1234' } });
        fireEvent.change(screen.getByLabelText(/Fuel Type/i), { target: { value: 'ethanol' } });
        fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: '45' } });

        fireEvent.click(screen.getByText('Save Vehicle'));

        await waitFor(() => {
            expect(apiClient.createVehicle).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Car',
                plate: 'ABC-1234',
                odometerUnit: 'KM' // Default
            }));

            expect(apiClient.createTank).toHaveBeenCalledWith(expect.objectContaining({
                vehicleId: 'v1',
                name: 'Main Tank',
                fuelType: 'ethanol',
                capacity: 45,
                isPrimary: true
            }));

            expect(mockNavigate).toHaveBeenCalledWith('/vehicles');
        });
    });

    it('loads existing vehicle for editing (read-only)', async () => {
        const mockVehicle = { id: '1', name: 'Existing Car', plate: 'XYZ-9876', odometerUnit: 'mi' };
        (apiClient.getVehicle as any).mockResolvedValue(mockVehicle);

        render(
            <MemoryRouter initialEntries={['/vehicles/1']}>
                <Routes>
                    <Route path="/vehicles/:id" element={<VehicleForm />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Car')).toBeInTheDocument();
            expect(screen.getByDisplayValue('XYZ-9876')).toBeInTheDocument();
        });
    });
});
