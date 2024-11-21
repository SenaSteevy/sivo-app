package com.sivo.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "Task")
@PlanningEntity
public class Task implements Serializable {

	private static final long serialVersionUID = 1L;

	@PlanningId
	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "job_id")
	@JsonIgnore
	@ToString.Exclude
	private Job job;

	@ManyToOne(cascade = CascadeType.REMOVE)
	@JoinColumn(name = "treatment")
	private Treatment treatment;

	@Column(name = "status")
	private String status;

	@Column(name = "startTime")
	@PlanningVariable(valueRangeProviderRefs = { "startTimeRange" })
	private LocalDateTime startTime;

	@Column(name = "realStartTime")
	private LocalDateTime realStartTime;

	@Column(name = "timeRangeStartTime")
	private LocalDateTime timeRangeStartTime;

//	@ValueRangeProvider(id = "startTimeRange")
//	public List<LocalDateTime> DateTimeRange() {
//
//		List<LocalDateTime> dateTimeList = new ArrayList<>();
//
//		LocalDateTime currentDateTime = LocalDateTime.now();
//
//		if (this.timeRangeStartTime != null) {
//
//			currentDateTime = this.timeRangeStartTime;
//		} else if (this.getJob().getDueDate().isBefore(currentDateTime)) {
//			currentDateTime = this.getJob().getDueDate();
//		}
//
//		while (currentDateTime.isBefore(this.getJob().getDueDate())) {
//			dateTimeList.add(currentDateTime);
//			currentDateTime = currentDateTime.plus(this.treatment.getPhase().getDuration());
//		}
//
//		if (dateTimeList.isEmpty()) {
//
//			while (currentDateTime.isBefore(this.getJob().getDueDate().plusDays(2))) {
//				dateTimeList.add(currentDateTime);
//				currentDateTime = currentDateTime.plus(this.treatment.getPhase().getDuration());
//			}
//		}
//		return dateTimeList;
//	}

	// Method to generate the date-time range
	@ValueRangeProvider(id = "startTimeRange")
	public List<LocalDateTime> DateTimeRange() {
		List<LocalDateTime> result = new ArrayList<>();

		LocalDateTime currentDateTime = LocalDateTime.now();

		if (this.timeRangeStartTime != null) {

			currentDateTime = this.timeRangeStartTime;
		} else if (this.getJob().getDueDate().isBefore(currentDateTime)) {
			currentDateTime = this.getJob().getDueDate().minusDays(2);
		}
		
		LocalDate dueDate = this.job.getDueDate().toLocalDate(); // Assuming getDueDate() returns LocalDateTime

		List<Timeslot> timeslots = this.getPhase().getTimeslotList(); // Get available timeslots for the phase
		
		 if (this.getPhase() == null || timeslots == null || job == null || dueDate == null) {
		        throw new IllegalStateException("Phase, TimeslotList, or Job Due Date is not properly initialized.");
		    }

		while (!currentDateTime.toLocalDate().isAfter(dueDate)) {
			for (Timeslot timeslot : timeslots) {
				if (currentDateTime.getDayOfWeek() == timeslot.getDayOfWeek()) {
					// Generate datetime within the timeslot
					LocalDateTime start = LocalDateTime.of(currentDateTime.toLocalDate(), timeslot.getStartTime());
					LocalDateTime end = LocalDateTime.of(currentDateTime.toLocalDate(), timeslot.getEndTime());

					// Add datetime ranges within the timeslot
					while (start.isBefore(end) && start.isBefore(job.getDueDate())) {
						if (!start.isBefore(currentDateTime)) { // Ensure it doesn't go back in time
							result.add(start);
						}
						start = start.plus(this.treatment.getPhase().getDuration()); // Adjust increment as needed (e.g., minutes, hours)
					}
				}
			}
			// Move to the next day
			currentDateTime = currentDateTime.toLocalDate().plusDays(1).atStartOfDay();
		}

		if (result.isEmpty()) {
			System.out.println("emty rangeTime, default to currentDateTime only : "+currentDateTime);
		    result.add(currentDateTime); // Add at least one valid datetime
		}
		return result;
	}

	public int getPhaseId() {
		return (int) this.treatment.getPhase().getId();
	}

	public Phase getPhase() {
		return this.treatment.getPhase();
	}

	public Task(Treatment treatment2) {
		this.treatment = treatment2;
		this.status = "UNDONE";
		this.timeRangeStartTime = LocalDateTime.of(2023, 1, 1, 18, 20);
	}

}
