package com.carfuel.mapper

import com.carfuel.dto.VehicleRequest
import com.carfuel.dto.VehicleResponse
import com.carfuel.entity.VehicleEntity

fun VehicleRequest.toEntity(): VehicleEntity =
    VehicleEntity(
        name = name.trim(),
        plate = plate?.trim()?.takeIf { it.isNotEmpty() },
        odometerUnit = odometerUnit ?: "KM"
    )

fun VehicleEntity.toResponse(): VehicleResponse =
    VehicleResponse(
        id = id.toString(),
        name = name,
        plate = plate,
        odometerUnit = odometerUnit,
        createdAt = createdAt,
        archivedAt = archivedAt
    )
