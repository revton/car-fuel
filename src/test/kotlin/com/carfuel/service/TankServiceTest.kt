package com.carfuel.service

import com.carfuel.dto.TankRequest
import com.carfuel.entity.TankEntity
import com.carfuel.repository.TankRepository
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
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class TankServiceTest {

    @Mock
    private lateinit var repository: TankRepository

    @InjectMocks
    private lateinit var service: TankService

    @Test
    fun `should create tank`() {
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 50.0,
            isPrimary = true
        )
        `when`(repository.save(any())).thenAnswer { invocation -> invocation.arguments[0] as TankEntity }

        val created = service.create(request)

        assertThat(created.vehicleId.toString()).isEqualTo(request.vehicleId)
        assertThat(created.fuelType).isEqualTo("gasoline")
        verify(repository).save(any())
    }

    @Test
    fun `should reject invalid pagination`() {
        assertThrows(InvalidQueryException::class.java) { service.list(0, 10, null) }
        assertThrows(InvalidQueryException::class.java) { service.list(1, 0, null) }
    }

    @Test
    fun `should get tank by id`() {
        val id = UUID.randomUUID()
        val entity = TankEntity(
            id = id,
            vehicleId = UUID.randomUUID(),
            name = "Aux",
            fuelType = "diesel",
            capacityLiters = 60.0,
            isPrimary = false
        )
        `when`(repository.findById(id)).thenReturn(Optional.of(entity))

        val response = service.getById(id.toString())

        assertThat(response.id).isEqualTo(id)
        assertThat(response.fuelType).isEqualTo("diesel")
    }

    @Test
    fun `should throw not found when missing`() {
        val id = UUID.randomUUID()
        `when`(repository.findById(id)).thenReturn(Optional.empty())

        assertThrows(ResourceNotFoundException::class.java) { service.getById(id.toString()) }
    }
}
