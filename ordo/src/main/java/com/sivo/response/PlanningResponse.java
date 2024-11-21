package com.sivo.response;

import java.time.LocalDateTime;
import java.util.List;

import com.sivo.domain.Job;
import com.sivo.domain.Planning;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString

public class PlanningResponse {
	
	private Long id;
	
	private List<Job> jobList;
	
	private Double rxRate;
	
	private Double dueDateRate;

	private LocalDateTime createdAt;
	
	public PlanningResponse(Planning planning) {
		this.id = planning.getId();
		this.rxRate = planning.getRxRate();
		this.dueDateRate = planning.getDueDateRate();
		this.createdAt = planning.getCreatedAt();
		this.jobList = planning.getJobList();
	}

}
