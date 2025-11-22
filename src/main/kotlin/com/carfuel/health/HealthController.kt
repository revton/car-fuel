package com.carfuel.health

import org.springframework.core.env.Environment
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.lang.management.ManagementFactory
import java.time.Duration
import java.time.Instant

@RestController
@RequestMapping("/v1/health")
class HealthController(
    private val environment: Environment
) {

    @GetMapping
    fun getHealth(): ResponseEntity<Map<String, Any>> {
        val version = javaClass.`package`.implementationVersion ?: "0.0.1-SNAPSHOT"
        val currentEnv = environment.activeProfiles.firstOrNull() ?: "local"
        val uptimeSeconds = Duration.ofMillis(ManagementFactory.getRuntimeMXBean().uptime).seconds

        val body = mapOf(
            "status" to "ok",
            "timestamp" to Instant.now().toString(),
            "version" to version,
            "environment" to currentEnv,
            "uptime_seconds" to uptimeSeconds
        )
        return ResponseEntity.ok(body)
    }
}
