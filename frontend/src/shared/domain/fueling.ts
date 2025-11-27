export interface Fueling {
    id: string;
    tankId: string;
    filledAt: string; // ISO date time
    odometer: number;
    volumeLiters: number;
    totalCost: number;
    fullTank: boolean;
    note?: string;
}

export const createEmptyFueling = (tankId: string = ''): Omit<Fueling, 'id'> => ({
    tankId,
    filledAt: new Date().toISOString().slice(0, 16), // datetime-local format YYYY-MM-DDTHH:mm
    odometer: 0,
    volumeLiters: 0,
    totalCost: 0,
    fullTank: true,
    note: '',
});
