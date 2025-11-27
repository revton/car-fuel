import { apiConfig } from '../config/apiConfig'

export interface HealthResponse {
  status: string
  timestamp?: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiConfig.baseUrl}/v1/health`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`)
  }

  return response.json()
}

