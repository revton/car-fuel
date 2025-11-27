import type { Vehicle } from '../domain/vehicle';
import type { Fueling } from '../domain/fueling';
import type { Tank } from '../domain/tank';

// Mock Data
let vehicles: Vehicle[] = [
    {
        id: '1',
        name: 'My Corolla',
        plate: 'ABC-1234',
        odometerUnit: 'KM',
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: '2',
        name: 'Work Truck',
        plate: 'XYZ-9876',
        odometerUnit: 'KM',
        createdAt: '2023-02-15T14:30:00Z',
    },
];

let tanks: Tank[] = [
    {
        id: 't1',
        vehicleId: '1',
        name: 'Main Tank',
        capacity: 50,
        fuelType: 'gasoline',
        isPrimary: true,
    },
    {
        id: 't2',
        vehicleId: '2',
        name: 'Diesel Tank',
        capacity: 80,
        fuelType: 'diesel',
        isPrimary: true,
    },
];

let fuelings: Fueling[] = [
    {
        id: '101',
        tankId: 't1',
        filledAt: '2023-10-25T10:00',
        odometer: 10500,
        volumeLiters: 40,
        totalCost: 223.60,
        fullTank: true,
        note: 'Shell Station',
    },
    {
        id: '102',
        tankId: 't1',
        filledAt: '2023-11-10T14:00',
        odometer: 11000,
        volumeLiters: 38,
        totalCost: 214.70,
        fullTank: true,
        note: 'BR Petrobras',
    },
];

export const mockApi = {
    // Vehicles
    getVehicles: async (): Promise<Vehicle[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...vehicles]), 500);
        });
    },

    getVehicle: async (id: string): Promise<Vehicle | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(vehicles.find((v) => v.id === id)), 300);
        });
    },

    createVehicle: async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
        return new Promise((resolve) => {
            const newVehicle: Vehicle = {
                ...vehicle,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString()
            };
            vehicles = [...vehicles, newVehicle];

            // Create default tank for new vehicle
            const defaultTank: Tank = {
                id: Math.random().toString(36).substr(2, 9),
                vehicleId: newVehicle.id,
                name: 'Main Tank',
                capacity: 50,
                fuelType: 'gasoline',
                isPrimary: true
            };
            tanks = [...tanks, defaultTank];

            setTimeout(() => resolve(newVehicle), 500);
        });
    },

    // Fuelings
    getFuelings: async (vehicleId?: string): Promise<Fueling[]> => {
        return new Promise((resolve) => {
            let result = [...fuelings];
            if (vehicleId) {
                // Find tanks for this vehicle
                const vehicleTankIds = tanks.filter(t => t.vehicleId === vehicleId).map(t => t.id);
                result = result.filter((f) => vehicleTankIds.includes(f.tankId));
            }
            setTimeout(() => resolve(result), 500);
        });
    },

    createFueling: async (fueling: Omit<Fueling, 'id'>): Promise<Fueling> => {
        return new Promise((resolve) => {
            const newFueling = { ...fueling, id: Math.random().toString(36).substr(2, 9) };
            fuelings = [...fuelings, newFueling];
            setTimeout(() => resolve(newFueling), 500);
        });
    },

    // Tanks
    getTanks: async (vehicleId: string): Promise<Tank[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(tanks.filter((t) => t.vehicleId === vehicleId)), 500);
        });
    },

    createTank: async (tank: Omit<Tank, 'id'>): Promise<Tank> => {
        return new Promise((resolve) => {
            const newTank = { ...tank, id: Math.random().toString(36).substr(2, 9) };
            tanks = [...tanks, newTank];
            setTimeout(() => resolve(newTank), 500);
        });
    },
};
