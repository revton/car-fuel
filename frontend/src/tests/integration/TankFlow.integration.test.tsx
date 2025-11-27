import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TankList } from '../../pages/Tanks/TankList';
import { TankForm } from '../../pages/Tanks/TankForm';
import { VehicleList } from '../../pages/Vehicles/VehicleList';
import { apiClient } from '../../shared/api/apiClient';

// Mock API Client
vi.mock('../../shared/api/apiClient', () => ({
    apiClient: {
        getVehicles: vi.fn(),
        getVehicle: vi.fn(),
        getTanks: vi.fn(),
        createTank: vi.fn(),
    },
}));

describe('Tank Flow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('navigates from Vehicle List to Tank List and adds a new tank', async () => {
        // 1. Setup Data
        const mockVehicles = [{ id: 'v1', name: 'Car 1', plate: 'ABC-1234', odometerUnit: 'KM' as const, createdAt: '2023-01-01' }];
        const mockTanks = [{ id: 't1', vehicleId: 'v1', name: 'Main Tank', fuelType: 'gasoline' as const, capacity: 50, isPrimary: true }];

        vi.mocked(apiClient.getVehicles).mockResolvedValue(mockVehicles);
        vi.mocked(apiClient.getVehicle).mockResolvedValue(mockVehicles[0]);
        vi.mocked(apiClient.getTanks).mockResolvedValue(mockTanks);
        vi.mocked(apiClient.createTank).mockResolvedValue({ id: 't2', ...mockTanks[0], name: 'Reserve Tank' });

        // 2. Render App with Routes
        render(
            <MemoryRouter initialEntries={['/vehicles']}>
                <Routes>
                    <Route path="/vehicles" element={<VehicleList />} />
                    <Route path="/vehicles/:vehicleId/tanks" element={<TankList />} />
                    <Route path="/vehicles/:vehicleId/tanks/new" element={<TankForm />} />
                </Routes>
            </MemoryRouter>
        );

        // 3. Verify Vehicle List and Click "Manage Tanks"
        await waitFor(() => expect(screen.getByText('Car 1')).toBeInTheDocument());
        const manageButton = screen.getByRole('button', { name: /manage tanks/i });
        await userEvent.click(manageButton);

        // 4. Verify Tank List Page
        await waitFor(() => expect(screen.getByText(/Tanks for Car 1/i)).toBeInTheDocument());
        expect(screen.getByText('Main Tank')).toBeInTheDocument();

        // 5. Click "Add Tank"
        const addTankButton = screen.getByRole('button', { name: /add tank/i });
        await userEvent.click(addTankButton);

        // 6. Verify Tank Form Page
        await waitFor(() => expect(screen.getByText(/Add New Tank/i)).toBeInTheDocument());

        // 7. Fill Form
        await userEvent.type(screen.getByLabelText(/Tank Name/i), 'Reserve Tank');
        await userEvent.type(screen.getByLabelText(/Capacity/i), '20');

        // 8. Submit
        const saveButton = screen.getByRole('button', { name: /save tank/i });
        await userEvent.click(saveButton);

        // 9. Verify API Call and Navigation back to List
        await waitFor(() => {
            expect(apiClient.createTank).toHaveBeenCalledWith({
                vehicleId: 'v1',
                name: 'Reserve Tank',
                fuelType: 'gasoline', // default
                capacity: 20,
                isPrimary: false // default
            });
        });

        // Should be back on list (mocked getTanks would be called again in real app, 
        // here we just check we are back on the list route conceptually or by checking UI elements if we re-rendered)
        // Since we are in MemoryRouter, we can check if the "Add Tank" button is visible again
        await waitFor(() => expect(screen.getByRole('button', { name: /add tank/i })).toBeInTheDocument());
    });
});
