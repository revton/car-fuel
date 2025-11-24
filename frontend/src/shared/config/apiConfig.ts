export interface CarFuelApiConfig {
  baseUrl: string
}

const defaultBaseUrl =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const apiConfig: CarFuelApiConfig = {
  baseUrl: defaultBaseUrl,
}

