import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { HomePage } from './HomePage'
import * as healthApi from '../shared/api/health'

vi.mock('../shared/api/health')

const mockedFetchHealth = healthApi as {
  fetchHealth: ReturnType<typeof vi.fn>
}

describe('HomePage', () => {
  beforeEach(() => {
    mockedFetchHealth.fetchHealth = vi.fn()
  })

  it('deve exibir o status retornado pelo endpoint /v1/health', async () => {
    mockedFetchHealth.fetchHealth.mockResolvedValue({
      status: 'ok',
      timestamp: '2025-11-24T12:00:00Z',
    })

    render(<HomePage />)

    expect(screen.getByText(/Verificando status da API/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/API status: ok/i)).toBeInTheDocument()
    })
  })
})

