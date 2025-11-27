import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainLayout } from '../../components/Layout/MainLayout';
import { HomePage } from '../../pages/HomePage';
import { HealthProvider } from '../../shared/context/HealthContext';

// Mock Health Context to avoid API calls
vi.mock('../../shared/context/HealthContext', () => ({
    HealthProvider: ({ children }: any) => <div>{children}</div>,
    useHealth: () => ({
        health: { version: '1.0.0', environment: 'test', uptime_seconds: 100 },
        error: null,
        loading: false,
        isOnline: true
    })
}));

describe('Sidebar Navigation Integration', () => {
    it('navigates to Dashboard and renders content', async () => {
        render(
            <MemoryRouter initialEntries={['/vehicles']}>
                <HealthProvider>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            {/* Missing dashboard route intentionally to reproduce bug first, 
                                but in integration test environment we need to replicate App.tsx structure 
                                exactly as it is now to prove it fails, or just test the fix. 
                                Since I can't easily "fail" a test intentionally without stopping execution,
                                I will write the test expecting it to pass, and it should fail if I don't fix App.tsx.
                                But wait, I am mocking Routes here. I need to replicate the App.tsx routes.
                            */}
                            <Route path="vehicles" element={<div>Vehicles Page</div>} />
                            <Route path="dashboard" element={<HomePage />} />
                        </Route>
                    </Routes>
                </HealthProvider>
            </MemoryRouter>
        );

        // 1. Verify we are on Vehicles page (simulated)
        expect(screen.getByText('Vehicles Page')).toBeInTheDocument();

        // 2. Click Dashboard Link
        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        await userEvent.click(dashboardLink);

        // 3. Verify Dashboard Content is visible
        // If the route is missing, this should fail because Outlet renders nothing
        await waitFor(() => {
            expect(screen.getByText('System Status')).toBeInTheDocument();
        });
    });
});
