package com.carfuel.controller

import com.carfuel.dto.FuelingRequest
import com.carfuel.dto.FuelingResponse
import com.carfuel.dto.FuelingsPage
import com.carfuel.service.FuelingService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URI
import java.time.Instant

@RestController
@RequestMapping("/v1/fuelings")
class FuelingController(
    private val fuelingService: FuelingService
) {

    @Suppress("LongParameterList")
    @GetMapping
    fun listFuelings(
        @RequestParam(name = "page", defaultValue = "1") page: Int,
        @RequestParam(name = "per_page", defaultValue = "20") perPage: Int,
        @RequestParam(name = "vehicle_id", required = false) vehicleId: String?,
        @RequestParam(name = "tank_id", required = false) tankId: String?,
        @RequestParam(name = "from", required = false) from: Instant?,
        @RequestParam(name = "to", required = false) to: Instant?
    ): ResponseEntity<FuelingsPage> {
        val result = fuelingService.list(page, perPage, vehicleId, tankId, from, to)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createFueling(@Valid @RequestBody input: FuelingRequest): ResponseEntity<FuelingResponse> {
        val created = fuelingService.create(input)
        val location = URI.create("/v1/fuelings/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @GetMapping("/{fueling_id}")
    fun getFueling(@PathVariable("fueling_id") id: String): ResponseEntity<FuelingResponse> {
        val fueling = fuelingService.getById(id)
        return ResponseEntity.ok(fueling)
    }
}
