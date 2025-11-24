package com.carfuel.dto

import jakarta.validation.Validation
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.UUID

class TankRequestValidationTest {
    private val validator = Validation.buildDefaultValidatorFactory().validator

    @Test
    fun `should fail when vehicleId or fuelType is blank`() {
        val request = TankRequest(
            vehicleId = " ",
            name = "Main",
            fuelType = "",
            capacityLiters = 50.0,
            isPrimary = true
        )

        val violations = validator.validate(request)

        assertThat(violations).isNotEmpty
    }

    @Test
    fun `should pass with valid fields`() {
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 50.0,
            isPrimary = true
        )

        val violations = validator.validate(request)

        assertThat(violations).isEmpty()
    }
}
