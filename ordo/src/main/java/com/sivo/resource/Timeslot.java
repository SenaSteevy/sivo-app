package com.sivo.resource;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.sivo.request.TimeslotRequest;

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
@Table(name="timeslot")
public class Timeslot implements Serializable {

	

	private static final long serialVersionUID = 1L;

	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id ;
	
	@Column(name = "day_of_week")
	private DayOfWeek dayOfWeek;
	
	@Column(name = "startTime")
//    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime startTime;
   
//    @JsonDeserialize(using = LocalTimeDeserializer.class)
	@Column(name = "endTime")
	private LocalTime endTime;
	
	
    public Timeslot(TimeslotRequest timeslotRequest) {
		this.dayOfWeek = timeslotRequest.getDayOfWeek();
		this.startTime = timeslotRequest.getStartTime();
		this.endTime = timeslotRequest.getEndTime();
	}
}