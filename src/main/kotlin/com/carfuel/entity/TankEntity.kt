package com.carfuel.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "tanks")
data class TankEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(nullable = false)
    val vehicleId: UUID,
    val name: String? = null,
    @Column(nullable = false)
    val fuelType: String,
    val capacityLiters: Double? = null,
    val isPrimary: Boolean = false
)
