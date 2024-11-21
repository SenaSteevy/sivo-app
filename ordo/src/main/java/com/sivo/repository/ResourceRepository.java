package com.sivo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sivo.resource.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

	
	
}
