package com.sivo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sivo.domain.Phase;

public interface PhaseRepository extends JpaRepository<Phase, Long> {

    List<Phase> findByName( String name);
	
}
