package com.carfuel

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Testcontainers
import org.slf4j.LoggerFactory

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
abstract class IntegrationTestBase protected constructor() {

    companion object {
        private val logger = LoggerFactory.getLogger(IntegrationTestBase::class.java)
        private val postgres: PostgreSQLContainer<Nothing>? = createContainerSafely()

        @JvmStatic
        @DynamicPropertySource
        fun registerProperties(registry: DynamicPropertyRegistry) {
            val container = postgres
            if (container != null) {
                logger.info("Using Testcontainers PostgreSQL at {}", container.jdbcUrl)
                println("TEST DATASOURCE: Testcontainers Postgres -> ${container.jdbcUrl}")
                registry.add("spring.datasource.url") { container.jdbcUrl }
                registry.add("spring.datasource.username") { container.username }
                registry.add("spring.datasource.password") { container.password }
                registry.add("spring.datasource.driver-class-name") { container.driverClassName }
            } else {
                logger.warn("Testcontainers PostgreSQL unavailable, falling back to in-memory H2")
                println("TEST DATASOURCE: H2 fallback (Testcontainers unavailable)")
                registry.add("spring.datasource.url") { "jdbc:h2:mem:carfuel;DB_CLOSE_DELAY=-1;MODE=PostgreSQL" }
                registry.add("spring.datasource.driver-class-name") { "org.h2.Driver" }
                registry.add("spring.datasource.username") { "sa" }
                registry.add("spring.datasource.password") { "" }
                registry.add("spring.jpa.hibernate.ddl-auto") { "create-drop" }
            }
        }

        private fun createContainerSafely(): PostgreSQLContainer<Nothing>? =
            runCatching {
                PostgreSQLContainer<Nothing>("postgres:16-alpine").apply {
                    withDatabaseName("carfuel")
                    withUsername("carfuel")
                    withPassword("carfuel")
                    start()
                }
            }.getOrNull()
    }
}
