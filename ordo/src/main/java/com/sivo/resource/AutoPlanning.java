package com.sivo.resource;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.sivo.request.AutoPlanningRequest;

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
@Table(name = "AutoPlanning")
public class AutoPlanning {
	
	@Id
	@Include
	@Column(name = "id")
	private long id;
	
	@Column(name="value")
	private String value;
	
	@ElementCollection
	@Column(name = "monday")
	private List<LocalTime> monday;
	
	@ElementCollection
	@Column(name = "tuesday")
	private List<LocalTime> tuesday;
	
	@ElementCollection
	@Column(name = "wednesday")
	private List<LocalTime> wednesday;
	
	@ElementCollection
	@Column(name = "thursday")
	private List<LocalTime> thursday;
	
	@ElementCollection
	@Column(name = "friday")
	private List<LocalTime> friday;
	
	@ElementCollection
	@Column(name = "saturday")
	private List<LocalTime> saturday;
	
	@ElementCollection
	@Column(name = "sunday")
	private List<LocalTime> sunday;
	


	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public AutoPlanning(String value) {
		this.value = value;
	}

	public AutoPlanning(AutoPlanningRequest autoPlanningRequest) {
		this.id = 1;
		this.value = autoPlanningRequest.getValue();
		this.monday = getLocalTimes(autoPlanningRequest.getMonday());
		this.tuesday = getLocalTimes(autoPlanningRequest.getTuesday());
		this.wednesday = getLocalTimes(autoPlanningRequest.getWednesday());
		this.thursday = getLocalTimes(autoPlanningRequest.getThursday());
		this.friday = getLocalTimes(autoPlanningRequest.getFriday());
		this.saturday = getLocalTimes(autoPlanningRequest.getSaturday());
		this.sunday  = getLocalTimes(autoPlanningRequest.getSunday());
		
	}

	private List<LocalTime> getLocalTimes(List<String> array) {

		List<LocalTime> localTimes = new ArrayList<LocalTime>()  ;
		
		if(array != null ) {	
			array.forEach(  (time) -> localTimes.add( LocalTime.parse(time)) );
		}
		
		return localTimes;
	}
	
	
}
