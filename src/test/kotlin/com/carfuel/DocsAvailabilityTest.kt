package com.carfuel

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

class DocsAvailabilityTest(
    @Autowired private val mockMvc: MockMvc
) : IntegrationTestBase() {

    @Test
    fun `should serve swagger ui`() {
        mockMvc.get("/docs")
            .andExpect {
                status { is3xxRedirection() }
                redirectedUrl("/swagger-ui/index.html")
            }
    }

    @Test
    fun `should serve redoc`() {
        mockMvc.get("/redoc.html")
            .andExpect {
                status { isOk() }
                content { contentTypeCompatibleWith(MediaType.TEXT_HTML) }
            }
    }

    @Test
    fun `should serve openapi yaml`() {
        mockMvc.get("/openapi/car-fuel-v1.yaml")
            .andExpect {
                status { isOk() }
                content { contentTypeCompatibleWith(MediaType.valueOf("application/octet-stream")) }
            }
    }
}
