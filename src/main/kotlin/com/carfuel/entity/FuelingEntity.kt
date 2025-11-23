package com.carfuel.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "fuelings")
data class FuelingEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tank_id", nullable = false)
    val tank: TankEntity,

    @Column(nullable = false)
    val filledAt: Instant,

    @Column(nullable = false)
    val odometer: Double,

    @Column(nullable = false)
    val volumeLiters: Double,

    @Column(nullable = false)
    val totalCost: Double,

    @Column(nullable = false)
    val fullTank: Boolean,

    @Column(length = 255)
    val note: String? = null
)
