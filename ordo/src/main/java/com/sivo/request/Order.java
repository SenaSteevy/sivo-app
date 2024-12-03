package com.sivo.request;

import com.sivo.domain.Job;

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

public class Order {

	private int numOrder;
		
	private String codeOrder ;
	
	private String description;
	
	private String supplement;
	
	private String type;

	private String dueDate;
	
	private int priority;

	private String createdAt;
	
	public Order(Job job) {
		this.numOrder = job.getNumOrder();
		this.codeOrder = job.getCodeOrder();
		this.description = job.getDescription();
		this.priority = job.getPriority();
		this.supplement = job.getSupplement();
		this.type = job.getType();
		this.createdAt = job.getCreatedAt().toString();
	}

}
