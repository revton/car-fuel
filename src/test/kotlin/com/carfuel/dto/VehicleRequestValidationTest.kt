package com.carfuel.dto

import jakarta.validation.Validation
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class VehicleRequestValidationTest {
    private val validator = Validation.buildDefaultValidatorFactory().validator

    @Test
    fun `should fail when name is blank`() {
        val request = VehicleRequest(name = " ", plate = null, odometerUnit = "KM")

        val violations = validator.validate(request)

        assertThat(violations).isNotEmpty
    }

    @Test
    fun `should pass when name is present`() {
        val request = VehicleRequest(name = "Valid", plate = null, odometerUnit = "KM")

        val violations = validator.validate(request)

        assertThat(violations).isEmpty()
    }
}
