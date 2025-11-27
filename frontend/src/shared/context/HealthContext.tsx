import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiClient, type HealthResponse } from '../api/apiClient';

interface HealthContextType {
    health: HealthResponse | null;
    error: string | null;
    loading: boolean;
    checkHealth: () => Promise<void>;
    isOnline: boolean;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const checkHealth = async () => {
        console.log('HealthContext: checkHealth started');
        setLoading(true);
        try {
            const data = await apiClient.getHealth();
            console.log('HealthContext: getHealth success', data);
            setHealth(data);
            setError(null);
        } catch (err) {
            console.error('HealthContext: getHealth failed', err);
            setError('Backend is unreachable');
            setHealth(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
        // Optional: Poll every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const isOnline = !!health && !error;

    return (
        <HealthContext.Provider value={{ health, error, loading, checkHealth, isOnline }}>
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => {
    const context = useContext(HealthContext);
    if (context === undefined) {
        throw new Error('useHealth must be used within a HealthProvider');
    }
    return context;
};
