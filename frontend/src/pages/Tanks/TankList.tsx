import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../shared/api/apiClient';
import type { Tank } from '../../shared/domain/tank';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState } from '../../components/UI/EmptyState';

export const TankList = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleName, setVehicleName] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Load tanks
                const tanksData = await apiClient.getTanks(vehicleId!);
                setTanks(tanksData);

                // Load vehicle details for the header (optional but good UX)
                try {
                    const vehicle = await apiClient.getVehicle(vehicleId!);
                    setVehicleName(vehicle.name);
                } catch (e) {
                    console.error('Failed to load vehicle details', e);
                }
            } catch (error) {
                console.error('Failed to load tanks', error);
            } finally {
                setLoading(false);
            }
        };

        if (vehicleId) {
            loadData();
        }
    }, [vehicleId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <Link to="/vehicles" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        &larr; Back to Vehicles
                    </Link>
                    <h2 style={{ marginTop: '5px' }}>Tanks {vehicleName ? `for ${vehicleName}` : ''}</h2>
                </div>
                <Button onClick={() => navigate(`/vehicles/${vehicleId}/tanks/new`)}>
                    Add Tank
                </Button>
            </div>

            {tanks.length === 0 ? (
                <EmptyState
                    title="No tanks found"
                    description="This vehicle has no tanks registered."
                    actionLabel="Add First Tank"
                    onAction={() => navigate(`/vehicles/${vehicleId}/tanks/new`)}
                    icon="⛽"
                />
            ) : (
                <div className="grid">
                    {tanks.map((tank) => (
                        <Card key={tank.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3>{tank.name}</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', margin: '5px 0' }}>
                                        {tank.fuelType.charAt(0).toUpperCase() + tank.fuelType.slice(1)}
                                    </p>
                                    <p>Capacity: {tank.capacity} L</p>
                                </div>
                                {tank.isPrimary && (
                                    <span style={{
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem'
                                    }}>
                                        Primary
                                    </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
