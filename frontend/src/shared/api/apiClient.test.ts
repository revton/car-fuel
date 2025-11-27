import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { apiClient } from './apiClient';
import { ApiError } from './apiErrors';
import type { Fueling } from '../domain/fueling';

global.fetch = vi.fn();

function mockFetchResponse(status: number, body: unknown) {
    (global.fetch as Mock).mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        json: async () => body,
    });
}

describe('apiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return data on success (200)', async () => {
        const mockData = { data: [{ id: '1', name: 'Car' }] };
        mockFetchResponse(200, mockData);

        const result = await apiClient.getVehicles();
        expect(result).toEqual(mockData.data);
    });

    it('should return health status', async () => {
        const mockHealth = { status: 'ok', version: '1.0.0', timestamp: '2023-01-01', environment: 'dev', uptime_seconds: 100 };
        mockFetchResponse(200, mockHealth);

        const result = await apiClient.getHealth();
        expect(result).toEqual(mockHealth);
    });

    it('should throw ApiError on 400 Bad Request', async () => {
        const errorBody = {
            title: 'Invalid request',
            status: 400,
            code: 'invalid_query_params',
            detail: 'page must be greater than zero'
        };
        mockFetchResponse(400, errorBody);

        await expect(apiClient.getVehicles()).rejects.toThrow('Invalid request');

        try {
            await apiClient.getVehicles();
        } catch (e) {
            const apiError = e as ApiError;
            expect(apiError).toBeInstanceOf(ApiError);
            expect(apiError.status).toBe(400);
            expect(apiError.code).toBe('invalid_query_params');
            expect(apiError.details).toBe('page must be greater than zero');
        }
    });

    it('should throw ApiError on 404 Not Found', async () => {
        const errorBody = {
            title: 'Vehicle not found',
            status: 404,
            code: 'vehicle_not_found',
            detail: 'No vehicle was found'
        };
        mockFetchResponse(404, errorBody);

        await expect(apiClient.getVehicle('123')).rejects.toThrow('Vehicle not found');
    });

    it('should throw ApiError on 409 Conflict', async () => {
        const errorBody = {
            title: 'Conflict',
            status: 409,
            code: 'conflict',
            detail: 'Plate already registered'
        };
        mockFetchResponse(409, errorBody);

        await expect(apiClient.createVehicle({ name: 'Car', plate: 'ABC', odometerUnit: 'KM' })).rejects.toThrow('Conflict');
    });

    it('should throw ApiError on 422 Unprocessable Entity', async () => {
        const errorBody = {
            title: 'Invalid request',
            status: 422,
            code: 'invalid_fill_payload',
            errors: { volume_liters: ['must_be_positive'] }
        };
        mockFetchResponse(422, errorBody);

        try {
            await apiClient.createFueling({} as Fueling);
        } catch (e) {
            const apiError = e as ApiError;
            expect(apiError.status).toBe(422);
            expect(apiError.errors).toEqual({ volume_liters: ['must_be_positive'] });
        }
    });

    it('should throw ApiError on 500 Internal Server Error', async () => {
        const errorBody = {
            title: 'Internal server error',
            status: 500,
            code: 'internal_error',
            detail: 'Unexpected error'
        };
        mockFetchResponse(500, errorBody);

        await expect(apiClient.getVehicles()).rejects.toThrow('Internal server error');
    });
});
