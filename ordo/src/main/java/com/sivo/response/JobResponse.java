package com.sivo.response;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

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

public class JobResponse {
	
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


}
