package com.carfuel.mapper

import com.carfuel.dto.TankRequest
import com.carfuel.dto.TankResponse
import com.carfuel.entity.TankEntity
import java.util.UUID

fun TankRequest.toEntity(): TankEntity =
    TankEntity(
        vehicleId = UUID.fromString(vehicleId),
        name = name?.trim()?.takeIf { it.isNotEmpty() },
        fuelType = fuelType,
        capacityLiters = capacityLiters,
        isPrimary = isPrimary
    )

fun TankEntity.toResponse(): TankResponse =
    TankResponse(
        id = id,
        vehicleId = vehicleId,
        name = name,
        fuelType = fuelType,
        capacityLiters = capacityLiters,
        isPrimary = isPrimary
    )
