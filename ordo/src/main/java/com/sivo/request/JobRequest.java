package com.sivo.request;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import com.sivo.domain.Job;
import com.sivo.domain.Task;
import com.sivo.resource.Client;
import com.sivo.resource.Resource;

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

public class JobRequest {

	

	private int numOrder;
		
	private String codeOrder ;
	
	private Client client;
	
	private String description;
	
	private String supplement;
	
	private String type;

	private LocalDateTime dueDate;
	
	private List<Task> taskList;
	
	private Resource resource;

	private LocalDateTime startDateTime;

	private Duration leadTime;

	private int priority;

	private String status;
	
	private LocalDateTime doneAt;
	
	private LocalDateTime createdAt;
	
	public JobRequest(Job job) {
		this.numOrder = job.getNumOrder();
		this.codeOrder = job.getCodeOrder();
		this.client = job.getClient();
		this.description = job.getDescription();
		this.doneAt = job.getDoneAt();
		this.dueDate = job.getDueDate();
		this.leadTime = job.getLeadTime();
		this.priority = job.getPriority();
		this.resource = job.getResource();
		this.startDateTime = job.getStartDateTime();
		this.status = job.getStatus();
		this.supplement = job.getSupplement();
		this.type = job.getType();
		this.taskList = job.getTaskList();
		this.createdAt = job.getCreatedAt();
	}

}
