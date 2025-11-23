package com.carfuel.controller

import com.carfuel.IntegrationTestBase
import com.carfuel.dto.TankRequest
import com.carfuel.repository.FuelingRepository
import com.carfuel.repository.TankRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.UUID

class TankControllerTest(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper,
    @Autowired private val fuelingRepository: FuelingRepository,
    @Autowired private val tankRepository: TankRepository
) : IntegrationTestBase() {

    @BeforeEach
    fun clean() {
        fuelingRepository.deleteAll()
        tankRepository.deleteAll()
    }

    @Test
    fun `should create tank`() {
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 50.0,
            isPrimary = true
        )

        mockMvc.post("/v1/tanks") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(request)
        }
            .andExpect {
                status { isCreated() }
                header { string("Location", containsString("/v1/tanks/")) }
                jsonPath("$.vehicle_id") { value(request.vehicleId) }
                jsonPath("$.fuel_type") { value("gasoline") }
            }
    }

    @Test
    fun `should list tanks`() {
        // create one
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = "Main",
            fuelType = "gasoline",
            capacityLiters = 40.0,
            isPrimary = true
        )
        mockMvc.post("/v1/tanks") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(request)
        }.andExpect { status { isCreated() } }

        mockMvc.get("/v1/tanks")
            .andExpect {
                status { isOk() }
                jsonPath("$.data.length()") { value(1) }
                jsonPath("$.meta.total_items") { value(1) }
            }
    }

    @Test
    fun `should get tank by id`() {
        val request = TankRequest(
            vehicleId = UUID.randomUUID().toString(),
            name = "Aux",
            fuelType = "ethanol",
            capacityLiters = 30.0,
            isPrimary = false
        )
        val location = mockMvc.post("/v1/tanks") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(request)
        }.andReturn().response.getHeader("Location")!!

        val id = location.substringAfterLast("/")
        mockMvc.get("/v1/tanks/$id")
            .andExpect {
                status { isOk() }
                jsonPath("$.id") { value(id) }
                jsonPath("$.fuel_type") { value("ethanol") }
            }
    }
}
