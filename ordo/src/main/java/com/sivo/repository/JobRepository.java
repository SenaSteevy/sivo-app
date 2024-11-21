package com.sivo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sivo.domain.Job;

public interface JobRepository extends JpaRepository<Job, Integer> {
	
	@Query("SELECT DISTINCT t.type FROM Job t")
    List<String> findAllTypes();

	

}
