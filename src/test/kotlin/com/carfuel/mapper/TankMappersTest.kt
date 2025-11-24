package com.carfuel.mapper

import com.carfuel.dto.TankRequest
import com.carfuel.entity.TankEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.UUID

class TankMappersTest {

    @Test
    fun `should map request to entity`() {
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = " Main ",
            fuelType = "gasoline",
            capacityLiters = 50.0,
            isPrimary = true
        )

        val entity = request.toEntity()

        assertThat(entity.vehicleId.toString()).isEqualTo(request.vehicleId)
        assertThat(entity.name).isEqualTo("Main")
        assertThat(entity.fuelType).isEqualTo("gasoline")
        assertThat(entity.capacityLiters).isEqualTo(50.0)
        assertThat(entity.isPrimary).isTrue()
    }

    @Test
    fun `should map entity to response`() {
        val entity = TankEntity(
            id = UUID.randomUUID(),
            vehicleId = UUID.randomUUID(),
            name = "Aux",
            fuelType = "ethanol",
            capacityLiters = 30.0,
            isPrimary = false
        )

        val response = entity.toResponse()

        assertThat(response.id).isEqualTo(entity.id)
        assertThat(response.vehicleId).isEqualTo(entity.vehicleId)
        assertThat(response.name).isEqualTo("Aux")
        assertThat(response.fuelType).isEqualTo("ethanol")
        assertThat(response.capacityLiters).isEqualTo(30.0)
        assertThat(response.isPrimary).isFalse()
    }
}
