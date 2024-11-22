package com.sivo.domain;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.sivo.request.JobRequest;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Include;
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

@Entity
@Table(name = "job")
public class Job {

	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "num_order")
	private Integer numOrder;

	@Column(name = "code_order")
	private String codeOrder;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "supplement")
	private String supplement ;

	@Column(name = "type")
	private String type;

	@Column(name = "due_date")
	private LocalDateTime dueDate;

	@ToString.Exclude
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "job", orphanRemoval = true)
	private List<Task> taskList;

	@Column(name = "startDateTime")
	private LocalDateTime startDateTime;

	@Column(name = "leadTime")
	private Duration leadTime;
	
	@Column(name = "createdAt")
	private LocalDateTime createdAt;

	@Column(name = "priority")
	private int priority;

	@Column(name = "status")
	private String status;
	
	
	@Column(name="doneAt")
	private LocalDateTime doneAt;

	public Job(JobRequest jobRequest) {

		this.numOrder = jobRequest.getNumOrder();
		this.codeOrder = jobRequest.getCodeOrder();
		this.description = jobRequest.getDescription();
		this.supplement = jobRequest.getSupplement();
		this.type = jobRequest.getType();
		this.dueDate = jobRequest.getDueDate();
		this.taskList = new ArrayList<Task>();
		this.startDateTime = jobRequest.getStartDateTime();
		this.leadTime = jobRequest.getLeadTime();
		this.priority = jobRequest.getPriority();
		this.status = jobRequest.getStatus();
		this.doneAt = jobRequest.getDoneAt();
		this.createdAt= jobRequest.getCreatedAt();	}

	public void updateTask(Task task) {
		
		this.taskList.remove(task);
		this.taskList.add(task);
		
	}
	
	// Helper method to add a Task
	public void addTask(Task task) {
	    task.setJob(this); // Set the job in the task
	    this.taskList.add(task); // Add to the task list
	}

	// Helper method to remove a Task
	public void removeTask(Task task) {
	    task.setJob(null); // Remove the job reference in the task
	    this.taskList.remove(task); // Remove from the task list
	}
	

}
