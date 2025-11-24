package com.carfuel.service

import com.carfuel.dto.FuelingRequest
import com.carfuel.dto.FuelingResponse
import com.carfuel.dto.FuelingsPage
import com.carfuel.dto.PaginationMeta
import com.carfuel.entity.FuelingEntity
import com.carfuel.mapper.toResponse
import com.carfuel.repository.FuelingRepository
import com.carfuel.repository.TankRepository
import com.carfuel.shared.InvalidPayloadException
import com.carfuel.shared.InvalidQueryException
import com.carfuel.shared.ResourceNotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class FuelingService(
    private val fuelingRepository: FuelingRepository,
    private val tankRepository: TankRepository
    // Services for vehicles/tanks endpoints can be added later; here we just validate existence.
) {

    fun create(request: FuelingRequest): FuelingResponse {
        val validationErrors = mutableMapOf<String, List<String>>()
        if (request.volumeLiters <= 0) validationErrors["volume_liters"] = listOf("must_be_positive")
        if (request.totalCost < 0) validationErrors["total_cost"] = listOf("must_be_non_negative")
        if (request.odometer < 0) validationErrors["odometer"] = listOf("must_be_non_negative")
        if (validationErrors.isNotEmpty()) {
            throw InvalidPayloadException(
                title = "Invalid request",
                code = "invalid_fill_payload",
                detail = "Fueling payload failed validation",
                errors = validationErrors
            )
        }

        val tankId = runCatching { UUID.fromString(request.tankId) }.getOrElse {
            throw InvalidPayloadException(
                title = "Invalid request",
                code = "invalid_fill_payload",
                detail = "tank_id must be a valid UUID",
                errors = mapOf("tank_id" to listOf("invalid_uuid"))
            )
        }

        val tank = tankRepository.findById(tankId).orElseThrow {
            ResourceNotFoundException(
                title = "Tank not found",
                code = "tank_not_found",
                instance = "/v1/fuelings",
                message = "No tank was found for id '$tankId'"
            )
        }

        val entity = FuelingEntity(
            tank = tank,
            filledAt = request.filledAt,
            odometer = request.odometer,
            volumeLiters = request.volumeLiters,
            totalCost = request.totalCost,
            fullTank = request.fullTank,
            note = request.note
        )

        return fuelingRepository.save(entity).toResponse()
    }

    @Suppress("LongParameterList")
    fun list(
        page: Int,
        perPage: Int,
        vehicleId: String?,
        tankId: String?,
        from: Instant?,
        to: Instant?
    ): FuelingsPage {
        if (page < 1 || perPage < 1) {
            throw InvalidQueryException("page and per_page must be greater than zero")
        }

        val parsedTankId = tankId?.let { parseUuidOrBadRequest(it, "tank_id") }
        val parsedVehicleId = vehicleId?.let { parseUuidOrBadRequest(it, "vehicle_id") }

        val pageable = PageRequest.of(page - 1, perPage)
        val result: Page<FuelingEntity> =
            if (from == null && to == null) {
                fuelingRepository.findWithFiltersNoDate(parsedTankId, parsedVehicleId, pageable)
            } else {
                fuelingRepository.findWithFilters(parsedTankId, parsedVehicleId, from, to, pageable)
            }

        return FuelingsPage(
            data = result.content.map { it.toResponse() },
            meta = PaginationMeta(
                page = page,
                perPage = perPage,
                totalItems = result.totalElements.toInt(),
                totalPages = result.totalPages
            )
        )
    }

    fun getById(id: String): FuelingResponse {
        val fuelingId = parseUuidOrBadRequest(id, "fueling_id")
        val fueling = fuelingRepository.findById(fuelingId).orElseThrow {
            ResourceNotFoundException(
                title = "Fueling not found",
                code = "fill_not_found",
                instance = "/v1/fuelings/$id",
                message = "No fueling was found for id '$id'"
            )
        }
        return fueling.toResponse()
    }

    private fun parseUuidOrBadRequest(value: String, field: String): UUID =
        runCatching { UUID.fromString(value) }.getOrElse {
            throw InvalidQueryException("$field must be a valid UUID")
        }
}
