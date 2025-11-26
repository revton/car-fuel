import { useHealth } from '../shared/context/HealthContext';
import { Card } from '../components/UI/Card';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { health, error, loading, isOnline } = useHealth();

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Card title="System Status">
          {loading && <div>Checking system health...</div>}

          {error && (
            <div style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🔴</span>
              <div>
                <strong>Offline</strong>
                <div>{error}</div>
              </div>
            </div>
          )}

          {health && (
            <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🟢</span>
              <div>
                <strong>Online</strong>
                <div>Version: {health.version}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Env: {health.environment} • Uptime: {Math.floor(health.uptime_seconds / 60)}m
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card title="Quick Actions">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isOnline ? (
              <>
                <Link to="/vehicles/new" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                  Add Vehicle
                </Link>
                <Link to="/fuelings/new" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                  Register Fueling
                </Link>
              </>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Actions unavailable while offline.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
