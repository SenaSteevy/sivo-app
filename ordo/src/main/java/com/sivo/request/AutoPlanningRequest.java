package com.sivo.request;

import java.util.List;

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

public class AutoPlanningRequest {
	
	
	private Integer id;
	
	private String value;
	
	private List<String> monday;
	private List<String> tuesday;
	private List<String> wednesday;
	private List<String> thursday;
	private List<String>  friday;
	private List<String> saturday;
	private List<String> sunday;
	
	public AutoPlanningRequest(String value) {
		this.id =  1;
		this.value = value;
	}

}
