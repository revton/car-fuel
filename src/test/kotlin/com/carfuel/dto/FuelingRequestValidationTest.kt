package com.carfuel.dto

import jakarta.validation.Validation
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.UUID

class FuelingRequestValidationTest {
    private val validator = Validation.buildDefaultValidatorFactory().validator

    @Test
    fun `should fail when tank_id is blank`() {
        val request = FuelingRequest(
            tankId = " ",
            filledAt = Instant.now(),
            odometer = 100.0,
            volumeLiters = 10.0,
            totalCost = 50.0,
            fullTank = true,
            note = null
        )

        val violations = validator.validate(request)

        assertThat(violations).isNotEmpty
    }

    @Test
    fun `should pass with valid fields`() {
        val request = FuelingRequest(
            tankId = UUID.randomUUID().toString(),
            filledAt = Instant.now(),
            odometer = 100.0,
            volumeLiters = 10.0,
            totalCost = 50.0,
            fullTank = true,
            note = "ok"
        )

        val violations = validator.validate(request)

        assertThat(violations).isEmpty()
    }
}
