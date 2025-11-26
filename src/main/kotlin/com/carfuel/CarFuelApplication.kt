package com.carfuel

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class CarFuelApplication {

    @Value("\${cors.allowed-origins}")
    lateinit var allowedOrigins: String

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                val origins = allowedOrigins.split(",").map { it.trim() }.toTypedArray()
                registry.addMapping("/**")
                    .allowedOrigins(*origins)
                    .allowedMethods("*")
            }
        }
    }
}

@Suppress("SpreadOperator")
fun main(args: Array<String>) {
    runApplication<CarFuelApplication>(*args)
}
