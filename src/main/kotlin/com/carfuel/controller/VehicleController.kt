package com.carfuel.controller

import com.carfuel.dto.VehicleRequest
import com.carfuel.dto.VehicleResponse
import com.carfuel.dto.VehiclesPage
import com.carfuel.service.VehicleService

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

@RestController
@RequestMapping("/v1/vehicles")
class VehicleController(
    private val vehicleService: VehicleService
) {

    @GetMapping
    fun listVehicles(
        @RequestParam(name = "page", defaultValue = "1") page: Int,
        @RequestParam(name = "per_page", defaultValue = "20") perPage: Int,
        @RequestParam(name = "plate", required = false) plate: String?
    ): ResponseEntity<VehiclesPage> {
        val result = vehicleService.list(page, perPage, plate)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createVehicle(@Valid @RequestBody input: VehicleRequest): ResponseEntity<VehicleResponse> {
        val created = vehicleService.create(input)
        val location = URI.create("/v1/vehicles/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @GetMapping("/{vehicle_id}")
    fun getVehicle(@PathVariable("vehicle_id") id: String): ResponseEntity<VehicleResponse> {
        val vehicle = vehicleService.getById(id)
        return ResponseEntity.ok(vehicle)
    }
}
