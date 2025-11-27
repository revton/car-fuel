import { ApiError, type ProblemDetails } from './apiErrors';
import type { Vehicle } from '../domain/vehicle';
import type { Tank, FuelType } from '../domain/tank';
import type { Fueling } from '../domain/fueling';

export interface HealthResponse {
    status: string;
    version: string;
    timestamp: string;
    environment: string;
    uptime_seconds: number;
}

// DTOs
interface TankDto {
    id: string;
    vehicle_id: string;
    name: string;
    capacity_liters: number;
    fuel_type: string;
    is_primary: boolean;
}

interface FuelingDto {
    id: string;
    tank_id: string;
    filled_at: string;
    odometer: number;
    volume_liters: number;
    total_cost: number;
    full_tank: boolean;
    note: string | null;
}

const API_HOST = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const BASE_URL = `${API_HOST}/v1`;

console.log('API Client Config:', {
    API_HOST,
    BASE_URL,
    MODE: import.meta.env.MODE
});

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
        if (response.status === 204) {
            return {} as T;
        }
        return response.json();
    }

    let problem: ProblemDetails;
    try {
        problem = await response.json();
    } catch {
        // Fallback if response is not JSON
        problem = {
            title: response.statusText,
            status: response.status,
            code: 'unknown_error',
            detail: 'Failed to parse error response'
        };
    }

    throw new ApiError(problem);
}

interface RequestInitWithTimeout extends RequestInit {
    timeout?: number;
}

async function fetchWithTimeout(resource: RequestInfo, options: RequestInitWithTimeout = {}): Promise<Response> {
    const { timeout = 5000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export const apiClient = {
    // Health
    getHealth: async (): Promise<HealthResponse> => {
        const response = await fetchWithTimeout(`${BASE_URL}/health`, { timeout: 2000 });
        return handleResponse<HealthResponse>(response);
    },

    // Vehicles
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await fetchWithTimeout(`${BASE_URL}/vehicles`);
        const page = await handleResponse<{ data: Vehicle[] }>(response);
        return page.data;
    },

    getVehicle: async (id: string): Promise<Vehicle> => {
        const response = await fetchWithTimeout(`${BASE_URL}/vehicles/${id}`);
        return handleResponse<Vehicle>(response);
    },

    createVehicle: async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
        const response = await fetchWithTimeout(`${BASE_URL}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: vehicle.name,
                plate: vehicle.plate,
                odometer_unit: vehicle.odometerUnit
            })
        });
        return handleResponse<Vehicle>(response);
    },

    // Tanks
    getTanks: async (vehicleId: string): Promise<Tank[]> => {
        const response = await fetchWithTimeout(`${BASE_URL}/tanks?vehicle_id=${vehicleId}`);
        const page = await handleResponse<{ data: TankDto[] }>(response);
        return page.data.map((t) => ({
            id: t.id,
            vehicleId: t.vehicle_id,
            name: t.name,
            capacity: t.capacity_liters,
            fuelType: t.fuel_type as FuelType,
            isPrimary: t.is_primary
        }));
    },

    createTank: async (tank: Omit<Tank, 'id'>): Promise<Tank> => {
        const response = await fetchWithTimeout(`${BASE_URL}/tanks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vehicle_id: tank.vehicleId,
                name: tank.name,
                fuel_type: tank.fuelType,
                capacity_liters: tank.capacity,
                is_primary: true // Defaulting to true for now as per UI simplicity
            })
        });
        return handleResponse<Tank>(response);
    },

    // Fuelings
    getFuelings: async (vehicleId?: string): Promise<Fueling[]> => {
        let url = `${BASE_URL}/fuelings`;
        if (vehicleId) {
            url += `?vehicle_id=${vehicleId}`;
        }
        const response = await fetchWithTimeout(url);
        const page = await handleResponse<{ data: FuelingDto[] }>(response);

        // Map backend response to domain model
        return page.data.map(f => ({
            id: f.id,
            tankId: f.tank_id,
            filledAt: f.filled_at,
            odometer: f.odometer,
            volumeLiters: f.volume_liters,
            totalCost: f.total_cost,
            fullTank: f.full_tank,
            note: f.note ?? undefined
        }));
    },

    createFueling: async (fueling: Omit<Fueling, 'id'>): Promise<Fueling> => {
        const response = await fetchWithTimeout(`${BASE_URL}/fuelings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tank_id: fueling.tankId,
                filled_at: fueling.filledAt,
                odometer: fueling.odometer,
                volume_liters: fueling.volumeLiters,
                total_cost: fueling.totalCost,
                full_tank: fueling.fullTank,
                note: fueling.note
            })
        });
        const f = await handleResponse<FuelingDto>(response);
        return {
            id: f.id,
            tankId: f.tank_id,
            filledAt: f.filled_at,
            odometer: f.odometer,
            volumeLiters: f.volume_liters,
            totalCost: f.total_cost,
            fullTank: f.full_tank,
            note: f.note ?? undefined
        };
    }
};
