package com.sivo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sivo.domain.Job;
import com.sivo.domain.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
	
	List<Task> findByJob(Job job);
    List<Task> findByStatusIgnoreCaseLike(String status);

}
