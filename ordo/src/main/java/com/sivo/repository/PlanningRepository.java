package com.sivo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sivo.domain.Planning;

public interface PlanningRepository extends JpaRepository<Planning, Long> {
	
	

}
