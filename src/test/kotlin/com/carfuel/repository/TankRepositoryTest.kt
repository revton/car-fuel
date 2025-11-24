package com.carfuel.repository

import com.carfuel.entity.TankEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles
import java.util.UUID

@DataJpaTest
@ActiveProfiles("test")
class TankRepositoryTest @Autowired constructor(
    private val repository: TankRepository
) {

    @Test
    fun `should save and retrieve tank`() {
        val tank = TankEntity(
            id = UUID.randomUUID(),
            vehicleId = UUID.randomUUID(),
            name = "RepoTank",
            fuelType = "gasoline",
            capacityLiters = 55.0,
            isPrimary = true
        )
        repository.save(tank)

        val found = repository.findById(tank.id)

        assertThat(found).isPresent
        assertThat(found.get().name).isEqualTo("RepoTank")
        assertThat(found.get().vehicleId).isEqualTo(tank.vehicleId)
    }
}
