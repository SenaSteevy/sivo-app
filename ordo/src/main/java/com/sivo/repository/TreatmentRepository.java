package com.sivo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sivo.domain.Phase;
import com.sivo.domain.Treatment;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {

	List<Treatment> findByPhase(Phase phase);

	@Query("SELECT t FROM Treatment t WHERE LOWER(t.phase.name) = LOWER(:name)")
    List<Treatment> findByPhaseName(@Param("name") String name);

	List<Treatment> findByDescription(String description);

}
