import { useEffect, useState } from 'react';
import type { Tank } from '../../shared/domain/tank';
import { mockApi } from '../../shared/api/mockClient';
import { Card } from '../../components/UI/Card';

interface TankListProps {
    vehicleId: string;
}

export const TankList = ({ vehicleId }: TankListProps) => {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTanks();
    }, [vehicleId]);

    const loadTanks = async () => {
        try {
            const data = await mockApi.getTanks(vehicleId);
            setTanks(data);
        } catch (error) {
            console.error('Failed to load tanks', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading tanks...</div>;

    if (tanks.length === 0) {
        return <div style={{ color: 'var(--color-text-muted)', padding: '10px 0' }}>No tanks found.</div>;
    }

    return (
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {tanks.map((tank) => (
                <Card key={tank.id}>
                    <div style={{ fontWeight: 'bold' }}>{tank.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {tank.capacity}L - {tank.fuelType}
                    </div>
                </Card>
            ))}
        </div>
    );
};
