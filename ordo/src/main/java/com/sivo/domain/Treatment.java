package com.sivo.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.optaplanner.core.api.domain.lookup.PlanningId;

import com.sivo.request.TreatmentRequest;

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
@Table(name = "Treatment")
public class Treatment {
	
	
	@PlanningId
	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@Column(name = "description")
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "phase_id")
	private Phase phase;
	
	public Treatment(String description, Phase phase) {
		this.description = description;
		this.phase = phase;
	}

	public Treatment(TreatmentRequest treatmentRequest) {
		this.description = treatmentRequest.getDescription();
		this.phase = treatmentRequest.getPhase();
	}
}
