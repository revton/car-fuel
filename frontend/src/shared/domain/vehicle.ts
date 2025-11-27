export interface Vehicle {
    id: string;
    name: string;
    plate?: string;
    odometerUnit: 'KM' | 'MI';
    createdAt: string;
    archivedAt?: string | null;
}

export const createEmptyVehicle = (): Omit<Vehicle, 'id' | 'createdAt'> => ({
    name: '',
    plate: '',
    odometerUnit: 'KM',
});
