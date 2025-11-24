package com.carfuel.repository

import com.carfuel.entity.FuelingEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface FuelingRepository : JpaRepository<FuelingEntity, UUID> {

    @Query(
        """
        SELECT f FROM FuelingEntity f
        JOIN f.tank t
        WHERE (:tankId IS NULL OR t.id = :tankId)
          AND (:vehicleId IS NULL OR t.vehicleId = :vehicleId)
        """
    )
    fun findWithFiltersNoDate(
        @Param("tankId") tankId: UUID?,
        @Param("vehicleId") vehicleId: UUID?,
        pageable: Pageable
    ): Page<FuelingEntity>

    @Query(
        """
        SELECT f FROM FuelingEntity f
        JOIN f.tank t
        WHERE (:tankId IS NULL OR t.id = :tankId)
          AND (:vehicleId IS NULL OR t.vehicleId = :vehicleId)
          AND (:fromDate IS NULL OR f.filledAt >= COALESCE(:fromDate, f.filledAt))
          AND (:toDate IS NULL OR f.filledAt <= COALESCE(:toDate, f.filledAt))
        """
    )
    fun findWithFilters(
        @Param("tankId") tankId: UUID?,
        @Param("vehicleId") vehicleId: UUID?,
        @Param("fromDate") fromDate: Instant?,
        @Param("toDate") toDate: Instant?,
        pageable: Pageable
    ): Page<FuelingEntity>
}
