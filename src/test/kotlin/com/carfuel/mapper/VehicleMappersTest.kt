package com.carfuel.mapper

import com.carfuel.dto.VehicleRequest
import com.carfuel.entity.VehicleEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.UUID

class VehicleMappersTest {

    @Test
    fun `toEntity should trim plate and default odometer unit`() {
        val request = VehicleRequest(
            name = "Car A",
            plate = " ABC123 ",
            odometerUnit = null
        )

        val entity = request.toEntity()

        assertThat(entity.name).isEqualTo("Car A")
        assertThat(entity.plate).isEqualTo("ABC123")
        assertThat(entity.odometerUnit).isEqualTo("KM")
    }

    @Test
    fun `toResponse should map all fields`() {
        val now = Instant.now()
        val entity = VehicleEntity(
            id = UUID.randomUUID(),
            name = "Car B",
            plate = "XYZ1A23",
            odometerUnit = "MI",
            createdAt = now,
            archivedAt = null
        )

        val response = entity.toResponse()

        assertThat(response.id).isEqualTo(entity.id.toString())
        assertThat(response.name).isEqualTo(entity.name)
        assertThat(response.plate).isEqualTo(entity.plate)
        assertThat(response.odometerUnit).isEqualTo(entity.odometerUnit)
        assertThat(response.createdAt).isEqualTo(entity.createdAt)
        assertThat(response.archivedAt).isNull()
    }
}
