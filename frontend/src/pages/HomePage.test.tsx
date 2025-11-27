import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router-dom';
import * as HealthContextModule from '../shared/context/HealthContext';

// Mock useHealth hook
vi.mock('../shared/context/HealthContext', async () => {
  const actual = await vi.importActual('../shared/context/HealthContext');
  return {
    ...actual,
    useHealth: vi.fn(),
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders online status when health check succeeds', () => {
    (HealthContextModule.useHealth as Mock).mockReturnValue({
      health: {
        status: 'ok',
        version: '1.0.0',
        environment: 'test',
        uptime_seconds: 100
      },
      error: null,
      loading: false,
      isOnline: true,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    screen.debug();

    expect(screen.getByText(/Online/i)).toBeInTheDocument();
    expect(screen.getByText(/1.0.0/)).toBeInTheDocument();
  });

  it('renders offline status when health check fails', () => {
    (HealthContextModule.useHealth as Mock).mockReturnValue({
      health: null,
      error: 'Backend is unreachable',
      loading: false,
      isOnline: false,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    (HealthContextModule.useHealth as Mock).mockReturnValue({
      health: null,
      error: null,
      loading: true,
      isOnline: false,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Checking system health...')).toBeInTheDocument();
  });
});
