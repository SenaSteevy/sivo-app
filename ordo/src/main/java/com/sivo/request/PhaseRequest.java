package com.sivo.request;

import java.time.Duration;
import java.util.List;

import com.sivo.resource.Timeslot;

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
public class PhaseRequest {
	
	private String name;
		
	private int capacity;
	
	private Duration duration;
	
	private List<Timeslot> timeslotList;
	 
}
