package com.carfuel.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.RequestParam
import java.time.Instant

data class FuelingRequest(
    @field:NotBlank
    @JsonProperty("tank_id")
    val tankId: String,
    @JsonProperty("filled_at")
    val filledAt: Instant,
    val odometer: Double,
    @JsonProperty("volume_liters")
    val volumeLiters: Double,
    @JsonProperty("total_cost")
    val totalCost: Double,
    @JsonProperty("full_tank")
    val fullTank: Boolean,
    val note: String? = null
)

data class FuelingResponse(
    val id: String,
    @JsonProperty("tank_id")
    val tankId: String,
    @JsonProperty("filled_at")
    val filledAt: Instant,
    val odometer: Double,
    @JsonProperty("volume_liters")
    val volumeLiters: Double,
    @JsonProperty("total_cost")
    val totalCost: Double,
    @JsonProperty("full_tank")
    val fullTank: Boolean,
    val note: String? = null
)

data class FuelingsPage(
    val data: List<FuelingResponse>,
    val meta: PaginationMeta
)
