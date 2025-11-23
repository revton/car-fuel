package com.carfuel.mapper

import com.carfuel.dto.FuelingResponse
import com.carfuel.entity.FuelingEntity

fun FuelingEntity.toResponse(): FuelingResponse =
    FuelingResponse(
        id = id.toString(),
        tankId = tank.id.toString(),
        filledAt = filledAt,
        odometer = odometer,
        volumeLiters = volumeLiters,
        totalCost = totalCost,
        fullTank = fullTank,
        note = note
    )
