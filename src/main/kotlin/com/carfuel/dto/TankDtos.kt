package com.carfuel.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class TankRequest(
    @field:NotBlank
    @JsonProperty("vehicle_id")
    val vehicleId: String,
    val name: String? = null,
    @field:NotBlank
    @JsonProperty("fuel_type")
    val fuelType: String,
    @JsonProperty("capacity_liters")
    val capacityLiters: Double? = null,
    @JsonProperty("is_primary")
    val isPrimary: Boolean = false
)

data class TankResponse(
    val id: UUID,
    @JsonProperty("vehicle_id")
    val vehicleId: UUID,
    val name: String? = null,
    @JsonProperty("fuel_type")
    val fuelType: String,
    @JsonProperty("capacity_liters")
    val capacityLiters: Double? = null,
    @JsonProperty("is_primary")
    val isPrimary: Boolean = false
)

data class TanksPage(
    val data: List<TankResponse>,
    val meta: PaginationMeta
)
