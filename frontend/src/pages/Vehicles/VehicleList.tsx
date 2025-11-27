import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '../../shared/domain/vehicle';
import { apiClient } from '../../shared/api/apiClient';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState } from '../../components/UI/EmptyState';

export const VehicleList = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await apiClient.getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to load vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Vehicles</h2>
                <Button onClick={() => navigate('/vehicles/new')}>+ Add Vehicle</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {vehicles.length === 0 ? (
                    <EmptyState
                        title="No Vehicles Found"
                        description="You haven't added any vehicles yet. Add your first vehicle to start tracking fuelings."
                        icon="🚗"
                        actionLabel="Add Vehicle"
                        onAction={() => navigate('/vehicles/new')}
                    />
                ) : (
                    vehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="vehicle-list-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{vehicle.name}</h3>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        {vehicle.plate} • {vehicle.odometerUnit}
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/vehicles/${vehicle.id}/tanks`);
                                    }}
                                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                >
                                    Manage Tanks
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
