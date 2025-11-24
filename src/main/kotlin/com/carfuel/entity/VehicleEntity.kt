package com.carfuel.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "vehicles")
data class VehicleEntity(
    @Id
    val id: UUID = UUID.randomUUID(),
    val name: String,
    @Column(unique = true)
    val plate: String? = null,
    val odometerUnit: String,
    val createdAt: Instant = Instant.now(),
    val archivedAt: Instant? = null
)
