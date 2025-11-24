package com.carfuel.repository

import com.carfuel.entity.VehicleEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles
import java.util.UUID

@DataJpaTest
@ActiveProfiles("test")
class VehicleRepositoryTest @Autowired constructor(
    private val repository: VehicleRepository
) {

    @Test
    fun `should find by plate ignoring case`() {
        val entity = VehicleEntity(
            id = UUID.randomUUID(),
            name = "Car Repo",
            plate = "ZZZ1A23",
            odometerUnit = "KM"
        )
        repository.save(entity)

        val page = repository.findByPlateContainingIgnoreCase(
            "zzz1",
            org.springframework.data.domain.PageRequest.of(0, 10)
        )

        assertThat(page.totalElements).isEqualTo(1)
        assertThat(page.content[0].plate).isEqualTo("ZZZ1A23")
        assertThat(repository.existsByPlateIgnoreCase("zzz1a23")).isTrue()
    }
}
