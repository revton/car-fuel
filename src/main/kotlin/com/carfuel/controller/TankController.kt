package com.carfuel.controller

import com.carfuel.dto.TankRequest
import com.carfuel.dto.TankResponse
import com.carfuel.dto.TanksPage
import com.carfuel.service.TankService
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
@RequestMapping("/v1/tanks")
class TankController(
    private val tankService: TankService
) {

    @GetMapping
    fun listTanks(
        @RequestParam(name = "page", defaultValue = "1") page: Int,
        @RequestParam(name = "per_page", defaultValue = "20") perPage: Int,
        @RequestParam(name = "vehicle_id", required = false) vehicleId: String?
    ): ResponseEntity<TanksPage> {
        val result = tankService.list(page, perPage, vehicleId)
        return ResponseEntity.ok(result)
    }

    @PostMapping
    fun createTank(@Valid @RequestBody input: TankRequest): ResponseEntity<TankResponse> {
        val created = tankService.create(input)
        val location = URI.create("/v1/tanks/${created.id}")
        return ResponseEntity.created(location).body(created)
    }

    @GetMapping("/{tank_id}")
    fun getTank(@PathVariable("tank_id") id: String): ResponseEntity<TankResponse> {
        val tank = tankService.getById(id)
        return ResponseEntity.ok(tank)
    }
}
