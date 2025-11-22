package com.carfuel

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CarFuelApplication

@Suppress("SpreadOperator")
fun main(args: Array<String>) {
    runApplication<CarFuelApplication>(*args)
}
