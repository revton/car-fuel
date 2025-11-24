package com.carfuel.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import java.time.Instant

data class VehicleRequest(
    @field:NotBlank
    val name: String,
    val plate: String? = null,
    @JsonProperty("odometer_unit")
    val odometerUnit: String? = null
)

data class VehicleResponse(
    val id: String,
    val name: String,
    val plate: String? = null,
    @JsonProperty("odometer_unit")
    val odometerUnit: String,
    @JsonProperty("created_at")
    val createdAt: Instant,
    @JsonProperty("archived_at")
    val archivedAt: Instant? = null
)

data class VehiclesPage(
    val data: List<VehicleResponse>,
    val meta: PaginationMeta
)

data class PaginationMeta(
    val page: Int,
    @JsonProperty("per_page")
    val perPage: Int,
    @JsonProperty("total_items")
    val totalItems: Int,
    @JsonProperty("total_pages")
    val totalPages: Int
)
