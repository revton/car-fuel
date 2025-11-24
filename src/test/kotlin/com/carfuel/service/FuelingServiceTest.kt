package com.carfuel.service

import com.carfuel.dto.FuelingRequest
import com.carfuel.entity.FuelingEntity
import com.carfuel.entity.TankEntity
import com.carfuel.mapper.toResponse
import com.carfuel.repository.FuelingRepository
import com.carfuel.repository.TankRepository
import com.carfuel.shared.InvalidPayloadException
import com.carfuel.shared.InvalidQueryException
import com.carfuel.shared.ResourceNotFoundException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Instant
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class FuelingServiceTest {

    @Mock
    private lateinit var fuelingRepository: FuelingRepository

    @Mock
    private lateinit var tankRepository: TankRepository

    @InjectMocks
    private lateinit var service: FuelingService

    @Test
    fun `should fail invalid payload`() {
        val request = FuelingRequest(
            tankId = UUID.randomUUID().toString(),
            filledAt = Instant.now(),
            odometer = -1.0,
            volumeLiters = 0.0,
            totalCost = -10.0,
            fullTank = true,
            note = null
        )

        assertThrows(InvalidPayloadException::class.java) { service.create(request) }
    }

    @Test
    fun `should fail when tank not found`() {
        val tankId = UUID.randomUUID()
        val request = FuelingRequest(
            tankId = tankId.toString(),
            filledAt = Instant.now(),
            odometer = 1000.0,
            volumeLiters = 10.0,
            totalCost = 50.0,
            fullTank = true,
            note = null
        )
        `when`(tankRepository.findById(tankId)).thenReturn(Optional.empty())

        assertThrows(ResourceNotFoundException::class.java) { service.create(request) }
    }

    @Test
    fun `should create fueling`() {
        val tankId = UUID.randomUUID()
        val tank = TankEntity(
            id = tankId,
            vehicleId = UUID.randomUUID(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 50.0,
            isPrimary = true
        )
        val request = FuelingRequest(
            tankId = tankId.toString(),
            filledAt = Instant.parse("2025-01-20T11:00:00Z"),
            odometer = 2000.0,
            volumeLiters = 30.0,
            totalCost = 150.0,
            fullTank = true,
            note = "Test"
        )
        `when`(tankRepository.findById(tankId)).thenReturn(Optional.of(tank))
        `when`(fuelingRepository.save(any())).thenAnswer { invocation ->
            val entity = invocation.arguments[0] as FuelingEntity
            entity
        }

        val response = service.create(request)

        assertThat(response.tankId).isEqualTo(tankId.toString())
        assertThat(response.volumeLiters).isEqualTo(30.0)
        verify(fuelingRepository).save(any())
    }

    @Test
    fun `should reject invalid pagination`() {
        assertThrows(InvalidQueryException::class.java) { service.list(0, 10, null, null, null, null) }
        assertThrows(InvalidQueryException::class.java) { service.list(1, 0, null, null, null, null) }
    }

    @Test
    fun `should get fueling by id`() {
        val tank = TankEntity(
            id = UUID.randomUUID(),
            vehicleId = UUID.randomUUID(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 40.0,
            isPrimary = true
        )
        val fueling = FuelingEntity(
            id = UUID.randomUUID(),
            tank = tank,
            filledAt = Instant.parse("2025-01-20T11:00:00Z"),
            odometer = 1500.0,
            volumeLiters = 20.0,
            totalCost = 90.0,
            fullTank = false,
            note = null
        )
        `when`(fuelingRepository.findById(fueling.id)).thenReturn(Optional.of(fueling))

        val response = service.getById(fueling.id.toString())

        assertThat(response.id).isEqualTo(fueling.id.toString())
        assertThat(response.tankId).isEqualTo(tank.id.toString())
    }

    @Test
    fun `should throw not found when fueling missing`() {
        val id = UUID.randomUUID()
        `when`(fuelingRepository.findById(id)).thenReturn(Optional.empty())

        assertThrows(ResourceNotFoundException::class.java) { service.getById(id.toString()) }
    }
}
