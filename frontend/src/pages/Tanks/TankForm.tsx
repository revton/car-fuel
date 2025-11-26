import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../shared/api/apiClient';
import type { Tank } from '../../shared/domain/tank';
import { FUEL_TYPES } from '../../shared/domain/tank';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

export const TankForm = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        fuelType: 'gasoline',
        capacity: 0,
        isPrimary: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleId) return;

        setLoading(true);
        try {
            await apiClient.createTank({
                vehicleId,
                name: formData.name,
                fuelType: formData.fuelType as Tank['fuelType'],
                capacity: Number(formData.capacity),
                isPrimary: formData.isPrimary
            });
            navigate(`/vehicles/${vehicleId}/tanks`);
        } catch (error) {
            console.error('Failed to create tank', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <Link to={`/vehicles/${vehicleId}/tanks`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    &larr; Back to Tanks
                </Link>
                <h2>Add New Tank</h2>
            </div>

            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Tank Name</label>
                        <input
                            id="name"
                            className="input-field"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Main Tank"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fuelType" style={{ display: 'block', marginBottom: '5px' }}>Fuel Type</label>
                        <select
                            id="fuelType"
                            className="input-field"
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleChange}
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
                            className="input-field"
                            type="number"
                            name="capacity"
                            value={formData.capacity || ''}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Button type="submit" disabled={loading}>
                            Save Tank
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate(`/vehicles/${vehicleId}/tanks`)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
