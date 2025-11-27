import { useEffect, useState } from 'react'
import { fetchHealth, type HealthResponse } from '../shared/api/health'

type HealthState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: HealthResponse }
  | { type: 'error'; error: string }

export function HomePage() {
  const [health, setHealth] = useState<HealthState>({ type: 'idle' })

  useEffect(() => {
    let active = true
    setHealth({ type: 'loading' })

    fetchHealth()
      .then((data) => {
        if (!active) return
        setHealth({ type: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        const message =
          error instanceof Error ? error.message : 'Erro ao consultar health'
        setHealth({ type: 'error', error: message })
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <h1>Car Fuel Web</h1>
      <p>Página inicial do Frontend MVP.</p>

      {health.type === 'loading' && <p>Verificando status da API...</p>}

      {health.type === 'error' && (
        <p role="alert">Falha ao consultar health: {health.error}</p>
      )}

      {health.type === 'success' && (
        <section aria-label="Status da API">
          <p>API status: {health.data.status}</p>
          {health.data.timestamp && (
            <p>Atualizado em: {health.data.timestamp}</p>
          )}
        </section>
      )}
    </main>
  )
}

export default HomePage

