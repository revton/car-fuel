package com.carfuel.service

import com.carfuel.dto.PaginationMeta
import com.carfuel.dto.TankRequest
import com.carfuel.dto.TankResponse
import com.carfuel.dto.TanksPage
import com.carfuel.entity.TankEntity
import com.carfuel.mapper.toEntity
import com.carfuel.mapper.toResponse
import com.carfuel.repository.TankRepository
import com.carfuel.shared.InvalidQueryException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class TankService(
    private val repository: TankRepository
) {

    fun create(request: TankRequest): TankResponse {
        val entity = request.toEntity()
        return repository.save(entity).toResponse()
    }

    fun list(page: Int, perPage: Int, vehicleId: String?): TanksPage {
        if (page < 1 || perPage < 1) throw InvalidQueryException("page and per_page must be greater than zero")

        val pageable = PageRequest.of(page - 1, perPage)
        val parsedVehicleId = vehicleId?.let { UUID.fromString(it) }
        val result: Page<TankEntity> = parsedVehicleId?.let {
            repository.findByVehicleId(it, pageable)
        } ?: repository.findAll(pageable)

        return TanksPage(
            data = result.content.map { it.toResponse() },
            meta = PaginationMeta(
                page = page,
                perPage = perPage,
                totalItems = result.totalElements.toInt(),
                totalPages = result.totalPages
            )
        )
    }

    fun getById(id: String): TankResponse {
        val tankId = UUID.fromString(id)
        val entity = repository.findById(tankId).orElseThrow {
            com.carfuel.shared.ResourceNotFoundException(
                title = "Tank not found",
                code = "tank_not_found",
                instance = "/v1/tanks/$id",
                message = "No tank was found for id '$id'"
            )
        }
        return entity.toResponse()
    }
}
