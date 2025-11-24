package com.carfuel.repository

import com.carfuel.entity.TankEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface TankRepository : JpaRepository<TankEntity, UUID> {
    fun findByVehicleId(vehicleId: UUID, pageable: Pageable): Page<TankEntity>
}
