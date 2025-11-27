import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmptyVehicle } from '../../shared/domain/vehicle';
import type { Vehicle } from '../../shared/domain/vehicle';
import { FUEL_TYPES } from '../../shared/domain/tank';
import { apiClient } from '../../shared/api/apiClient';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { TankList } from './TankList';

export const VehicleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vehicle, setVehicle] = useState<Partial<Vehicle>>(createEmptyVehicle());
    const [loading, setLoading] = useState(false);

    const [initialTank, setInitialTank] = useState<{
        fuelType: 'gasoline' | 'ethanol' | 'diesel' | 'flex' | 'hybrid' | 'electric' | 'gas';
        capacity: number;
    }>({
        fuelType: 'gasoline',
        capacity: 50
    });

    useEffect(() => {
        if (id) {
            loadVehicle(id);
        }
    }, [id]);

    const loadVehicle = async (vehicleId: string) => {
        setLoading(true);
        try {
            const data = await apiClient.getVehicle(vehicleId);
            if (data) {
                setVehicle(data);
            }
        } catch (error) {
            console.error('Failed to load vehicle', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                // API does not support update yet, but keeping for mock
                // await mockApi.updateVehicle(id, vehicle);
                console.warn('Update not supported by API v1');
            } else {
                const newVehicle = await apiClient.createVehicle(vehicle as Omit<Vehicle, 'id' | 'createdAt'>);
                await apiClient.createTank({
                    vehicleId: newVehicle.id,
                    name: 'Main Tank',
                    fuelType: initialTank.fuelType,
                    capacity: initialTank.capacity,
                    isPrimary: true
                });
            }
            navigate('/vehicles');
        } catch (error) {
            console.error('Failed to save vehicle', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleTankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInitialTank((prev) => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
    };

    if (loading && id && !vehicle.id) return <div>Loading...</div>;

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>{id ? 'Vehicle Details' : 'New Vehicle'}</h2>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name (Nickname)</label>
                        <input
                            id="name"
                            className="input-field"
                            name="name"
                            value={vehicle.name || ''}
                            onChange={handleChange}
                            required
                            disabled={!!id} // Read-only if editing (since API doesn't support update)
                        />
                    </div>
                    <div>
                        <label htmlFor="plate" style={{ display: 'block', marginBottom: '5px' }}>Plate</label>
                        <input
                            id="plate"
                            className="input-field"
                            name="plate"
                            value={vehicle.plate || ''}
                            onChange={handleChange}
                            disabled={!!id}
                        />
                    </div>
                    <div>
                        <label htmlFor="odometerUnit" style={{ display: 'block', marginBottom: '5px' }}>Odometer Unit</label>
                        <select
                            id="odometerUnit"
                            className="input-field"
                            name="odometerUnit"
                            value={vehicle.odometerUnit || 'KM'}
                            onChange={handleChange}
                            disabled={!!id}
                        >
                            <option value="KM">KM</option>
                            <option value="MI">Miles</option>
                        </select>
                    </div>

                    {!id && (
                        <>
                            <h3 style={{ marginTop: '15px', marginBottom: '10px' }}>Primary Tank</h3>
                            <div>
                                <label htmlFor="fuelType" style={{ display: 'block', marginBottom: '5px' }}>Fuel Type</label>
                                <select
                                    id="fuelType"
                                    className="input-field"
                                    name="fuelType"
                                    value={initialTank.fuelType}
                                    onChange={handleTankChange}
                                    required
                                >
                                    {FUEL_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="capacity" style={{ display: 'block', marginBottom: '5px' }}>Capacity (Liters)</label>
                                <input
                                    id="capacity"
                                    type="number"
                                    className="input-field"
                                    name="capacity"
                                    value={initialTank.capacity}
                                    onChange={handleTankChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </>
                    )}

                    {!id && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Vehicle'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => navigate('/vehicles')}>
                                Cancel
                            </Button>
                        </div>
                    )}
                    {id && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <Button type="button" variant="secondary" onClick={() => navigate('/vehicles')}>
                                Back
                            </Button>
                        </div>
                    )}
                </form>
            </Card>

            {id && (
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Tanks</h3>
                    <TankList vehicleId={id} />
                </div>
            )}
        </div>
    );
};
