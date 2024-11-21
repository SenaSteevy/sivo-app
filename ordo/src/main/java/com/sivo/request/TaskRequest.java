package com.sivo.request;

import java.time.LocalDateTime;

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

public class TaskRequest {
	
		
	private String type;
	
	private String status;
	
	private LocalDateTime  startTime ;
	
	private LocalDateTime  realStartTime ;
	

}
