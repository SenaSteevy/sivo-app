package com.sivo.domain;

import java.io.Serializable;
import java.time.Duration;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sivo.request.PhaseRequest;
import com.sivo.resource.Timeslot;

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
@Table(name = "phase")
public class Phase implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@Include
	@Column(name="name")
	private String name;
	
	@Column(name = "capacity")
	private int capacity;
	
	@Column( name = "duration")
	private Duration duration;
	
	
	@OneToMany(cascade = CascadeType.ALL,orphanRemoval = true, fetch=FetchType.EAGER)
	@JoinColumn(name = "phase_id")
	private List<Timeslot> timeslotList;
	
	@OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
	@JsonIgnore
	@ToString.Exclude
    private List<Treatment> treatments;
	 
	public Phase(PhaseRequest phaseRequest) {

		this.name = phaseRequest.getName();
		this.capacity = phaseRequest.getCapacity();
		this.duration = phaseRequest.getDuration();
		this.timeslotList = phaseRequest.getTimeslotList();

	}

	public Phase(String string, int i, Duration ofMinutes, List<Timeslot> timeslotList2) {
		this.name = string;
		this.capacity = i;
		this.duration = ofMinutes;
		this.timeslotList = timeslotList2;
	}


	

}
