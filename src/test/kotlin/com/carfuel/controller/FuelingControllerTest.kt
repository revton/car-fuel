package com.carfuel.controller

import com.carfuel.IntegrationTestBase
import com.carfuel.entity.FuelingEntity
import com.carfuel.entity.TankEntity
import com.carfuel.repository.FuelingRepository
import com.carfuel.repository.TankRepository
import org.hamcrest.Matchers.containsString
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.time.Instant
import java.util.UUID

class FuelingControllerTest(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val tankRepository: TankRepository,
    @Autowired private val fuelingRepository: FuelingRepository
) : IntegrationTestBase() {

    @BeforeEach
    fun clean() {
        fuelingRepository.deleteAll()
        tankRepository.deleteAll()
    }

    private fun createTank(): TankEntity =
        tankRepository.save(
            TankEntity(
                vehicleId = UUID.randomUUID(),
                name = "Main",
                fuelType = "gasoline",
                capacityLiters = 50.0,
                isPrimary = true
            )
        )

    @Test
    fun `should create fueling`() {
        val tank = createTank()
        val payload = """
            {
              "tank_id": "${tank.id}",
              "filled_at": "2025-01-20T11:00:00Z",
              "odometer": 23500.4,
              "volume_liters": 45.2,
              "total_cost": 261.41,
              "full_tank": true,
              "note": "Posto Central"
            }
        """.trimIndent()

        mockMvc.post("/v1/fuelings") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }
            .andExpect {
                status { isCreated() }
                header { string("Location", containsString("/v1/fuelings/")) }
                jsonPath("$.tank_id") { value(tank.id.toString()) }
                jsonPath("$.volume_liters") { value(45.2) }
            }
    }

    @Test
    fun `should return 404 when tank not found`() {
        val payload = """
            {
              "tank_id": "${UUID.randomUUID()}",
              "filled_at": "2025-01-20T11:00:00Z",
              "odometer": 1000,
              "volume_liters": 10.0,
              "total_cost": 50.0,
              "full_tank": true
            }
        """.trimIndent()

        mockMvc.post("/v1/fuelings") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }.andExpect {
            status { isNotFound() }
            jsonPath("$.code") { value("tank_not_found") }
        }
    }

    @Test
    fun `should return 422 for invalid payload`() {
        val tank = createTank()
        val payload = """
            {
              "tank_id": "${tank.id}",
              "filled_at": "2025-01-20T11:00:00Z",
              "odometer": -1,
              "volume_liters": 0,
              "total_cost": -10,
              "full_tank": true
            }
        """.trimIndent()

        mockMvc.post("/v1/fuelings") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }.andExpect {
            status { isUnprocessableEntity() }
            jsonPath("$.code") { value("invalid_fill_payload") }
            jsonPath("$.errors.odometer") { exists() }
            jsonPath("$.errors.volume_liters") { exists() }
            jsonPath("$.errors.total_cost") { exists() }
        }
    }

    @Test
    fun `should list fuelings filtered by tank`() {
        val tank = createTank()
        val otherTank = createTank()

        fuelingRepository.save(
            FuelingEntity(
                tank = tank,
                filledAt = Instant.parse("2025-01-20T11:00:00Z"),
                odometer = 1000.0,
                volumeLiters = 10.0,
                totalCost = 50.0,
                fullTank = true
            )
        )
        fuelingRepository.save(
            FuelingEntity(
                tank = tank,
                filledAt = Instant.parse("2025-01-21T12:00:00Z"),
                odometer = 1100.0,
                volumeLiters = 20.0,
                totalCost = 100.0,
                fullTank = false
            )
        )
        // Different tank
        fuelingRepository.save(
            FuelingEntity(
                tank = otherTank,
                filledAt = Instant.parse("2025-01-22T12:00:00Z"),
                odometer = 500.0,
                volumeLiters = 15.0,
                totalCost = 70.0,
                fullTank = true
            )
        )

        mockMvc.get("/v1/fuelings?tank_id=${tank.id}")
            .andExpect {
                status { isOk() }
                jsonPath("$.data", hasSize<Int>(2))
                jsonPath("$.meta.total_items") { value(2) }
            }
    }

    @Test
    fun `should get fueling by id`() {
        val tank = createTank()
        val fueling = fuelingRepository.save(
            FuelingEntity(
                tank = tank,
                filledAt = Instant.parse("2025-01-20T11:00:00Z"),
                odometer = 2000.0,
                volumeLiters = 30.0,
                totalCost = 150.0,
                fullTank = true
            )
        )

        mockMvc.get("/v1/fuelings/${fueling.id}")
            .andExpect {
                status { isOk() }
                jsonPath("$.id") { value(fueling.id.toString()) }
                jsonPath("$.tank_id") { value(tank.id.toString()) }
            }

        mockMvc.get("/v1/fuelings/${UUID.randomUUID()}")
            .andExpect {
                status { isNotFound() }
                jsonPath("$.code") { value("fill_not_found") }
            }
    }
}
