import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState } from '../../components/UI/EmptyState';
import { useFuelingHistory } from '../../shared/hooks/useFuelingHistory';

export const FuelingList = () => {
    const navigate = useNavigate();
    const { fuelings, loading } = useFuelingHistory();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Fueling History</h2>
                <Button onClick={() => navigate('/fuelings/new')}>+ Register Fueling</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {fuelings.length === 0 ? (
                    <EmptyState
                        title="No Fuelings Recorded"
                        description="You haven't recorded any fuelings yet. Register your first fueling to track costs and efficiency."
                        icon="⛽"
                        actionLabel="Register Fueling"
                        onAction={() => navigate('/fuelings/new')}
                    />
                ) : (
                    fuelings.map((fueling) => (
                        <Card key={fueling.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '2px' }}>
                                        {fueling.vehicleName} • {fueling.tankName}
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        {new Date(fueling.filledAt).toLocaleDateString()} {new Date(fueling.filledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        {fueling.volumeLiters}L • {fueling.note || 'No notes'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                        ${fueling.totalCost.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        {fueling.odometer} km
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
