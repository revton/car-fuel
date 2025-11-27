import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmptyFueling } from '../../shared/domain/fueling';
import type { Fueling } from '../../shared/domain/fueling';
import type { Vehicle } from '../../shared/domain/vehicle';
import type { Tank } from '../../shared/domain/tank';
import { apiClient } from '../../shared/api/apiClient';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

export const FuelingForm = () => {
    const navigate = useNavigate();
    const [fueling, setFueling] = useState<Partial<Fueling>>(createEmptyFueling());
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [pricePerLiter, setPricePerLiter] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicleId) {
            loadTanks(selectedVehicleId);
        } else {
            setTanks([]);
        }
    }, [selectedVehicleId]);

    const loadVehicles = async () => {
        try {
            const data = await apiClient.getVehicles();
            setVehicles(data);
            if (data.length > 0) {
                setSelectedVehicleId(data[0].id);
            }
        } catch (error) {
            console.error('Failed to load vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTanks = async (vehicleId: string) => {
        try {
            const data = await apiClient.getTanks(vehicleId);
            setTanks(data);
            if (data.length > 0) {
                const primaryTank = data.find(t => t.isPrimary) || data[0];
                setFueling(prev => ({ ...prev, tankId: primaryTank.id }));
            }
        } catch (error) {
            console.error('Failed to load tanks', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...fueling,
                filledAt: new Date(fueling.filledAt!).toISOString()
            };
            await apiClient.createFueling(payload as Omit<Fueling, 'id'>);
            navigate('/fuelings');
        } catch (error) {
            console.error('Failed to save fueling', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number | boolean = value;

        if (type === 'number') {
            newValue = parseFloat(value);
        } else if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setFueling((prev) => {
            const updated = { ...prev, [name]: newValue };
            return updated;
        });
    };

    useEffect(() => {
        console.log('Effect running:', { volume: fueling.volumeLiters, price: pricePerLiter });
        if (fueling.volumeLiters && pricePerLiter) {
            const cost = parseFloat((fueling.volumeLiters! * pricePerLiter).toFixed(2));
            console.log('Calculated cost:', cost);
            setFueling(prev => ({
                ...prev,
                totalCost: cost
            }));
        }
    }, [fueling.volumeLiters, pricePerLiter]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        console.log('handlePriceChange:', price);
        setPricePerLiter(price);
    };

    const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const liters = parseFloat(e.target.value);
        console.log('handleLitersChange:', liters);
        setFueling(prev => ({ ...prev, volumeLiters: liters }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Register Fueling</h2>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="vehicleId" style={{ display: 'block', marginBottom: '5px' }}>Vehicle</label>
                        <select
                            id="vehicleId"
                            className="input-field"
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                            required
                        >
                            {vehicles.map((v) => (
                                <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tankId" style={{ display: 'block', marginBottom: '5px' }}>Tank</label>
                        <select
                            id="tankId"
                            className="input-field"
                            name="tankId"
                            value={fueling.tankId || ''}
                            onChange={handleChange}
                            required
                            disabled={tanks.length === 0}
                        >
                            {tanks.map((t) => (
                                <option key={t.id} value={t.id}>{t.name} ({t.fuelType})</option>
                            ))}
                        </select>
                        {tanks.length === 0 && <small style={{ color: 'var(--color-warning)' }}>No tanks found for this vehicle.</small>}
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="filledAt" style={{ display: 'block', marginBottom: '5px' }}>Date & Time</label>
                            <input
                                id="filledAt"
                                className="input-field"
                                type="datetime-local"
                                name="filledAt"
                                value={fueling.filledAt || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="odometer" style={{ display: 'block', marginBottom: '5px' }}>Odometer</label>
                            <input
                                id="odometer"
                                className="input-field"
                                type="number"
                                name="odometer"
                                value={fueling.odometer || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="pricePerLiter" style={{ display: 'block', marginBottom: '5px' }}>Price / Liter</label>
                            <input
                                id="pricePerLiter"
                                className="input-field"
                                type="number"
                                step="0.01"
                                value={pricePerLiter || ''}
                                onChange={handlePriceChange}
                                placeholder="0.00"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="volumeLiters" style={{ display: 'block', marginBottom: '5px' }}>Volume (Liters)</label>
                            <input
                                id="volumeLiters"
                                className="input-field"
                                type="number"
                                step="0.01"
                                name="volumeLiters"
                                value={fueling.volumeLiters || ''}
                                onChange={handleLitersChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="totalCost" style={{ display: 'block', marginBottom: '5px' }}>Total Cost</label>
                        <input
                            id="totalCost"
                            className="input-field"
                            type="number"
                            step="0.01"
                            name="totalCost"
                            value={fueling.totalCost || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            id="fullTank"
                            name="fullTank"
                            checked={fueling.fullTank}
                            onChange={handleChange}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label htmlFor="fullTank">Full Tank?</label>
                    </div>

                    <div>
                        <label htmlFor="note" style={{ display: 'block', marginBottom: '5px' }}>Note (Optional)</label>
                        <textarea
                            id="note"
                            className="input-field"
                            name="note"
                            value={fueling.note || ''}
                            onChange={handleChange}
                            rows={3}
                            maxLength={255}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Button type="submit" disabled={loading || !fueling.tankId}>
                            Save Fueling
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/fuelings')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
