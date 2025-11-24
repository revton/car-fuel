package com.carfuel.controller

import com.carfuel.IntegrationTestBase
import com.carfuel.dto.VehicleRequest
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.UUID

class VehicleControllerTest(
    @Autowired private val mockMvc: MockMvc
) : IntegrationTestBase() {

    @Test
    fun `should create and retrieve vehicle`() {
        val payload = """
            {
              "name": "Corolla 2018",
              "plate": "ABC1D23",
              "odometer_unit": "KM"
            }
        """.trimIndent()

        val location = mockMvc.post("/v1/vehicles") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }
            .andExpect {
                status { isCreated() }
                header { string("Location", containsString("/v1/vehicles/")) }
                jsonPath("$.id") { exists() }
                jsonPath("$.name") { value("Corolla 2018") }
                jsonPath("$.plate") { value("ABC1D23") }
                jsonPath("$.odometer_unit") { value("KM") }
            }
            .andReturn()
            .response
            .getHeader("Location")!!

        val id = location.substringAfterLast("/")

        mockMvc.get("/v1/vehicles/$id")
            .andExpect {
                status { isOk() }
                jsonPath("$.id") { value(id) }
                jsonPath("$.plate") { value("ABC1D23") }
            }
    }

    @Test
    fun `should reject duplicate plate with conflict`() {
        val payload = """
            { "name": "Car A", "plate": "XYZ1A23" }
        """.trimIndent()

        mockMvc.post("/v1/vehicles") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }.andExpect { status { isCreated() } }

        mockMvc.post("/v1/vehicles") {
            contentType = MediaType.APPLICATION_JSON
            content = payload
        }.andExpect {
            status { isConflict() }
            jsonPath("$.code") { value("conflict") }
            jsonPath("$.detail") { value(containsString("XYZ1A23")) }
        }
    }

    @Test
    fun `should filter vehicles by plate`() {
        val payload1 = """{ "name": "Car A", "plate": "AAA1B23" }"""
        val payload2 = """{ "name": "Car B", "plate": "BBB1C23" }"""
        listOf(payload1, payload2).forEach { body ->
            mockMvc.post("/v1/vehicles") {
                contentType = MediaType.APPLICATION_JSON
                content = body
            }.andExpect { status { isCreated() } }
        }

        mockMvc.get("/v1/vehicles?plate=aaa")
            .andExpect {
                status { isOk() }
                jsonPath("$.data.length()") { value(1) }
                jsonPath("$.data[0].plate") { value("AAA1B23") }
            }
    }

    @Test
    fun `should return 400 for invalid pagination`() {
        mockMvc.get("/v1/vehicles?page=0")
            .andExpect {
                status { isBadRequest() }
                jsonPath("$.code") { value("invalid_query_params") }
            }
    }

    @Test
    fun `should return 404 when vehicle not found`() {
        val randomId = UUID.randomUUID().toString()
        mockMvc.get("/v1/vehicles/$randomId")
            .andExpect {
                status { isNotFound() }
                jsonPath("$.code") { value("vehicle_not_found") }
                jsonPath("$.instance") { value("/v1/vehicles/$randomId") }
            }
    }
}
