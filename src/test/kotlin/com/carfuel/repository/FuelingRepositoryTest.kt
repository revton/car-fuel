package com.carfuel.repository

import com.carfuel.entity.FuelingEntity
import com.carfuel.entity.TankEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.domain.PageRequest
import org.springframework.test.context.ActiveProfiles
import java.time.Instant
import java.util.UUID

@DataJpaTest
@ActiveProfiles("test")
class FuelingRepositoryTest @Autowired constructor(
    private val tankRepository: TankRepository,
    private val fuelingRepository: FuelingRepository
) {

    private fun createTank(vehicleId: UUID, name: String, fuelType: String): TankEntity =
        tankRepository.save(
            TankEntity(
                vehicleId = vehicleId,
                name = name,
                fuelType = fuelType,
                capacityLiters = 50.0,
                isPrimary = true
            )
        )

    private data class FuelingData(
        val filledAt: String,
        val odometer: Double,
        val volume: Double,
        val cost: Double,
        val fullTank: Boolean
    )

    private fun createFueling(
        tank: TankEntity,
        data: FuelingData
    ): FuelingEntity =
        fuelingRepository.save(
            FuelingEntity(
                tank = tank,
                filledAt = Instant.parse(data.filledAt),
                odometer = data.odometer,
                volumeLiters = data.volume,
                totalCost = data.cost,
                fullTank = data.fullTank
            )
        )

    @Test
    fun `should filter by tank vehicle and date`() {
        val vehicleId = UUID.randomUUID()
        val tank = createTank(vehicleId, "Main", "gasoline")
        val otherTank = createTank(UUID.randomUUID(), "Other", "ethanol")

        val f1 = createFueling(
            tank = tank,
            data = FuelingData(
                filledAt = "2025-01-20T11:00:00Z",
                odometer = 1000.0,
                volume = 20.0,
                cost = 100.0,
                fullTank = true
            )
        )
        val f2 = createFueling(
            tank = tank,
            data = FuelingData(
                filledAt = "2025-01-21T11:00:00Z",
                odometer = 1200.0,
                volume = 15.0,
                cost = 80.0,
                fullTank = false
            )
        )
        createFueling(
            tank = otherTank,
            data = FuelingData(
                filledAt = "2025-01-22T11:00:00Z",
                odometer = 500.0,
                volume = 10.0,
                cost = 60.0,
                fullTank = true
            )
        )

        val pageByTank = fuelingRepository.findWithFilters(
            tankId = tank.id,
            vehicleId = null,
            fromDate = null,
            toDate = null,
            pageable = PageRequest.of(0, 10)
        )
        assertThat(pageByTank.totalElements).isEqualTo(2)

        val pageByVehicle = fuelingRepository.findWithFilters(
            tankId = null,
            vehicleId = vehicleId,
            fromDate = Instant.parse("2025-01-20T10:00:00Z"),
            toDate = Instant.parse("2025-01-21T12:00:00Z"),
            pageable = PageRequest.of(0, 10)
        )
        assertThat(pageByVehicle.totalElements).isEqualTo(2)
        assertThat(pageByVehicle.content.map { it.id }.toSet()).containsExactlyInAnyOrder(f1.id, f2.id)
    }
}
