package com.carfuel.controller

import com.carfuel.IntegrationTestBase
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

class HealthControllerTest(
    @Autowired private val mockMvc: MockMvc
) : IntegrationTestBase() {

    @Test
    fun `should return ok status`() {
        mockMvc.get("/v1/health")
            .andExpect {
                status { isOk() }
                jsonPath("$.status") { value("ok") }
                jsonPath("$.timestamp") { exists() }
                jsonPath("$.version") { exists() }
                jsonPath("$.environment") { exists() }
                jsonPath("$.uptime_seconds") { isNumber() }
            }
    }
}
