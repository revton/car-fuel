package com.carfuel.repository

import com.carfuel.entity.VehicleEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface VehicleRepository : JpaRepository<VehicleEntity, UUID> {
    fun existsByPlateIgnoreCase(plate: String): Boolean
    fun findByPlateContainingIgnoreCase(plate: String, pageable: Pageable): Page<VehicleEntity>
}
