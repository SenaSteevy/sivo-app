package com.sivo.resource;

import com.sivo.domain.Task;

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


public class PhaseTime  {

	private String name;
	
	private String startTime;
	
	public PhaseTime(Task task) {
		this.name = task.getPhase().getName();
		this.startTime = task.getStartTime().toString();
	}
}