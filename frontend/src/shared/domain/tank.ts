export interface Tank {
    id: string;
    vehicleId: string;
    name: string;
    capacity: number;
    fuelType: FuelType;
    isPrimary: boolean;
}

export type FuelType = 'gasoline' | 'ethanol' | 'diesel' | 'flex' | 'hybrid' | 'electric' | 'gas';

export const FUEL_TYPES: { value: FuelType; label: string }[] = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'ethanol', label: 'Ethanol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'flex', label: 'Flex' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'gas', label: 'Gas (CNG/LPG/GPL)' },
];

export const createEmptyTank = (vehicleId: string = ''): Omit<Tank, 'id'> => ({
    vehicleId,
    name: 'Main Tank',
    capacity: 50,
    fuelType: 'gasoline',
    isPrimary: true,
});
