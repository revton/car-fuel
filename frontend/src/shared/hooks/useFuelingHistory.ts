import { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import type { Fueling } from '../domain/fueling';

export interface EnrichedFueling extends Fueling {
    vehicleName: string;
    tankName: string;
}

export const useFuelingHistory = () => {
    const [fuelings, setFuelings] = useState<EnrichedFueling[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [fuelingsData, vehiclesData] = await Promise.all([
                apiClient.getFuelings(),
                apiClient.getVehicles()
            ]);

            // Build lookup map for tanks
            const tankLookup: Record<string, { vehicleName: string, tankName: string }> = {};

            await Promise.all(vehiclesData.map(async (vehicle) => {
                try {
                    const tanks = await apiClient.getTanks(vehicle.id);
                    tanks.forEach(tank => {
                        tankLookup[tank.id] = {
                            vehicleName: vehicle.name,
                            tankName: tank.name
                        };
                    });
                } catch (e) {
                    console.error(`Failed to load tanks for vehicle ${vehicle.id}`, e);
                }
            }));

            // Enrich fuelings
            const enriched = fuelingsData.map(f => ({
                ...f,
                vehicleName: tankLookup[f.tankId]?.vehicleName || 'Unknown Vehicle',
                tankName: tankLookup[f.tankId]?.tankName || 'Unknown Tank'
            }));

            setFuelings(enriched);
        } catch (err) {
            console.error('Failed to load fueling history', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { fuelings, loading, error, refresh: loadData };
};
