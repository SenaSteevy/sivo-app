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

	@Column(name = "startTime")
	@PlanningVariable(valueRangeProviderRefs = "dateTimeRange")
	private LocalDateTime startTime;

	@Column(name = "realStartTime")
	private LocalDateTime realStartTime;

	@Column(name = "status")
	private String status;

	@Column(name = "timeRangeStartTime")
	private LocalDateTime timeRangeStartTime;

	@ManyToOne(cascade = CascadeType.REMOVE)
	@JoinColumn(name = "treatment")
	private Treatment treatment;

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
	@ValueRangeProvider(id = "dateTimeRange")
	public List<LocalDateTime> DateTimeRange() {
		List<LocalDateTime> result = new ArrayList<>();

		// Initialize currentDateTime based on timeRangeStartTime or job creation date
		LocalDateTime currentDateTime = (this.timeRangeStartTime != null) ? this.timeRangeStartTime
				: this.getJob().getCreatedAt();

		if (job == null || job.getDueDate() == null) {
			throw new IllegalStateException("Job or Job.dueDate is null");
		}
		LocalDate dueDate = this.job.getDueDate().toLocalDate(); // Assuming getDueDate() returns LocalDateTime
		List<Timeslot> timeslots = this.getPhase().getTimeslotList(); // Get available timeslots for the phase

		// Ensure that necessary objects are initialized
		if (this.getPhase() == null || timeslots.isEmpty() || job == null || dueDate == null) {
			throw new IllegalStateException("Phase, TimeslotList, or Job Due Date is not properly initialized.");
		}

		// Loop until currentDateTime is past dueDate
		while (!currentDateTime.toLocalDate().isAfter(dueDate)) {

			for (Timeslot timeslot : timeslots) {

				// Match the day of the week for each timeslot
				if (currentDateTime.getDayOfWeek() == timeslot.getDayOfWeek()) {

					LocalDateTime start = LocalDateTime.of(currentDateTime.toLocalDate(), timeslot.getStartTime());
					LocalDateTime end = LocalDateTime.of(currentDateTime.toLocalDate(), timeslot.getEndTime());

					// Add datetime ranges within the timeslot, checking if it's within job's due
					// date
					while (start.isBefore(end) && !start.isAfter(job.getDueDate())) {
						if (!start.isBefore(currentDateTime)) { // Ensure it doesn't go back in time
							result.add(start);
						}
						start = start.plus(this.treatment.getPhase().getDuration()); // Adjust increment as needed
					}
				}
			}

			// Move to the next day
			currentDateTime = currentDateTime.plusDays(1).toLocalDate().atStartOfDay();
		}

		// If no valid time slots found, add the current date as a fallback
		if (result.isEmpty()) {
			System.out.println("empty rangeTime, default to currentDateTime only: " + currentDateTime);
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

	public Task(Treatment treatment2, Job job2) {
		this.treatment = treatment2;
		this.job = job2;
		this.status = "UNDONE";
	}

}
