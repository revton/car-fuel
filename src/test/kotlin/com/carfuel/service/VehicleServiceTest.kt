package com.carfuel.service

import com.carfuel.dto.VehicleRequest
import com.carfuel.entity.VehicleEntity
import com.carfuel.mapper.toResponse
import com.carfuel.repository.VehicleRepository
import com.carfuel.shared.ConflictException
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
class VehicleServiceTest {

    @Mock
    private lateinit var repository: VehicleRepository

    @InjectMocks
    private lateinit var service: VehicleService

    @Test
    fun `should reject duplicate plate`() {
        val request = VehicleRequest(name = "Car A", plate = "XYZ1234", odometerUnit = "KM")
        `when`(repository.existsByPlateIgnoreCase("XYZ1234")).thenReturn(true)

        assertThrows(ConflictException::class.java) { service.create(request) }
        verify(repository).existsByPlateIgnoreCase("XYZ1234")
    }

    @Test
    fun `should list with invalid pagination`() {
        assertThrows(InvalidQueryException::class.java) { service.list(0, 10, null) }
        assertThrows(InvalidQueryException::class.java) { service.list(1, 0, null) }
    }

    @Test
    fun `should get vehicle by id or throw not found`() {
        val id = UUID.randomUUID()
        val entity = VehicleEntity(
            id = id,
            name = "Car B",
            plate = "ABC1D23",
            odometerUnit = "KM"
        )
        `when`(repository.findById(id)).thenReturn(Optional.of(entity))

        val found = service.getById(id.toString())

        assertThat(found.id).isEqualTo(id.toString())

        `when`(repository.findById(id)).thenReturn(Optional.empty())
        assertThrows(ResourceNotFoundException::class.java) { service.getById(id.toString()) }
    }

    @Test
    fun `should create vehicle when plate not duplicated`() {
        val request = VehicleRequest(name = "Car C", plate = "AAA1B23", odometerUnit = "KM")
        `when`(repository.existsByPlateIgnoreCase("AAA1B23")).thenReturn(false)
        `when`(repository.save(any())).thenAnswer { invocation ->
            invocation.arguments[0] as VehicleEntity
        }

        val created = service.create(request)

        assertThat(created.name).isEqualTo("Car C")
        assertThat(created.plate).isEqualTo("AAA1B23")
    }
}
