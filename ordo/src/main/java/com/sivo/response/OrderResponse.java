package com.sivo.response;

import java.util.ArrayList;
import java.util.List;

import com.sivo.domain.Job;
import com.sivo.resource.PhaseTime;

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

public class OrderResponse {

	private int numOrder;

	private String codeOrder;

	private String type;

	private String description;

	private String supplement;

	private String createdAt; 
	
	private String dueDate;

	private String startDateTime;

	private String leadTime;

	private int priority;

	private List<PhaseTime> phaseTimeList;

	public OrderResponse(Job job) {

		this.numOrder = job.getNumOrder();
		this.codeOrder = job.getCodeOrder();
		this.type = job.getType();
		this.description = job.getDescription();
		this.supplement = job.getSupplement();
		this.createdAt = job.getCreatedAt().toString();
		this.dueDate = job.getDueDate().toString();
		this.startDateTime = job.getStartDateTime().toString();
		this.leadTime = job.getLeadTime().toString();
		this.priority = job.getPriority();
		
		List<PhaseTime> phaseTimeList = new ArrayList<PhaseTime>();
		
		job.getTaskList().stream().forEach(task -> {
			if (task.getStartTime() != null) {
				
				phaseTimeList.add(new PhaseTime(task));
			}else {
				phaseTimeList.add(new PhaseTime());
			}
		});
		this.phaseTimeList = phaseTimeList;
	}

}
