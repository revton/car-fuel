package com.carfuel.service

import com.carfuel.shared.ConflictException
import com.carfuel.shared.InvalidQueryException
import com.carfuel.shared.ResourceNotFoundException
import com.carfuel.dto.PaginationMeta
import com.carfuel.dto.VehicleRequest
import com.carfuel.dto.VehicleResponse
import com.carfuel.dto.VehiclesPage
import com.carfuel.entity.VehicleEntity
import com.carfuel.mapper.toEntity
import com.carfuel.mapper.toResponse
import com.carfuel.repository.VehicleRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class VehicleService(
    private val repository: VehicleRepository
) {

    fun create(request: VehicleRequest): VehicleResponse {
        val entity = request.toEntity()
        entity.plate?.let { plate ->
            if (repository.existsByPlateIgnoreCase(plate)) {
                throw ConflictException(
                    title = "Conflict",
                    code = "conflict",
                    message = "Plate $plate is already registered"
                )
            }
        }
        return repository.save(entity).toResponse()
    }

    fun list(page: Int, perPage: Int, plateFilter: String?): VehiclesPage {
        if (page < 1 || perPage < 1) throw InvalidQueryException("page and per_page must be greater than zero")

        val pageable = PageRequest.of(page - 1, perPage)
        val result: Page<VehicleEntity> = if (!plateFilter.isNullOrBlank()) {
            repository.findByPlateContainingIgnoreCase(plateFilter, pageable)
        } else {
            repository.findAll(pageable)
        }

        return VehiclesPage(
            data = result.content.map { it.toResponse() },
            meta = PaginationMeta(
                page = page,
                perPage = perPage,
                totalItems = result.totalElements.toInt(),
                totalPages = result.totalPages
            )
        )
    }

    fun getById(id: String): VehicleResponse {
        return repository.findById(UUID.fromString(id)).orElse(null)?.toResponse()
            ?: throw ResourceNotFoundException(
                title = "Vehicle not found",
                code = "vehicle_not_found",
                instance = "/v1/vehicles/$id",
                message = "No vehicle was found for id '$id'"
            )
    }
}
