package com.sivo.request;

import java.time.DayOfWeek;
import java.time.LocalTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.sivo.resource.LocalTimeDeserializer;

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
public class TimeslotRequest {
	
	
	private DayOfWeek dayOfWeek;
	
    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime startTime;
   
    @JsonDeserialize(using = LocalTimeDeserializer.class)
	private LocalTime endTime;
	

}