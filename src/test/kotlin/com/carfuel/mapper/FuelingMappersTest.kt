package com.carfuel.mapper

import com.carfuel.entity.FuelingEntity
import com.carfuel.entity.TankEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.UUID

class FuelingMappersTest {

    @Test
    fun `should map fueling entity to response`() {
        val tank = TankEntity(
            id = UUID.randomUUID(),
            vehicleId = UUID.randomUUID(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 45.0,
            isPrimary = true
        )
        val entity = FuelingEntity(
            id = UUID.randomUUID(),
            tank = tank,
            filledAt = Instant.parse("2025-01-20T11:00:00Z"),
            odometer = 1234.5,
            volumeLiters = 20.0,
            totalCost = 100.0,
            fullTank = true,
            note = "Test"
        )

        val response = entity.toResponse()

        assertThat(response.id).isEqualTo(entity.id.toString())
        assertThat(response.tankId).isEqualTo(tank.id.toString())
        assertThat(response.filledAt).isEqualTo(entity.filledAt)
        assertThat(response.volumeLiters).isEqualTo(20.0)
        assertThat(response.totalCost).isEqualTo(100.0)
        assertThat(response.fullTank).isTrue()
        assertThat(response.note).isEqualTo("Test")
    }
}
