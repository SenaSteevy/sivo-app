package com.sivo.score;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.optaplanner.core.api.score.buildin.hardmediumsoft.HardMediumSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintCollectors;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

import com.sivo.domain.Task;

public class Constraints implements ConstraintProvider {

	@Override
	public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
		return new Constraint [] {
				maxCapacity(constraintFactory),
				anteriorityTask(constraintFactory),
				ResourceShouldBefull(constraintFactory),
				minimizeTimeGapBetweenTasks(constraintFactory),
				enforceStartTimeSelection(constraintFactory), // New constraint
	            startTimeInRange(constraintFactory), // New constraint
	            noOverlappingTasksWithSameTreatment(constraintFactory)
		};
	}

	private Constraint ResourceShouldBefull(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.groupBy(Task::getStartTime, Task::getPhase, ConstraintCollectors.count())
				.filter((startTime, phase, count) -> startTime != null && count <= phase.getCapacity())
				.penalize(HardMediumSoftScore.ONE_MEDIUM, (startTime, phase, count) -> phase.getCapacity() - count)
				.asConstraint("Resource should be full");
	}
	
	private Constraint minimizeTimeGapBetweenTasks(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.filter(task -> task.getStartTime() != null) // considérer uniquement les tâches avec une heure de début non-nulle
				.filter(task -> task.getPhase().getId() > 0) // considérer uniquement les tâches avec des phases non-nulles
		        .join(Task.class,
		            Joiners.equal(Task::getJob),
		            Joiners.lessThan(Task::getPhaseId))
		        .penalize( HardMediumSoftScore.ONE_SOFT, (task1, task2) -> {
		        	 
		        	LocalDateTime endDateTime = task1.getStartTime().plus(task1.getPhase().getDuration());
		             LocalDateTime startDateTimeOfNextTask = task2.getStartTime();
		             Duration timeGap = Duration.between(endDateTime, startDateTimeOfNextTask);
		             return  timeGap.isNegative() ?  0 : (int) timeGap.toMinutes();
		        })
		        .asConstraint("minimize time Gap between tasks");
				}

	

	private Constraint anteriorityTask(ConstraintFactory constraintFactory) {
	    return constraintFactory.forEach(Task.class)
	            .filter(task -> task.getPhase().getId() > 0) // Consider only tasks with valid phases
	            .filter(task -> task.getStartTime() != null) // Consider only tasks with a valid start time
	            .join(Task.class,
	                Joiners.equal(Task::getJob), // Join tasks by job
	                Joiners.lessThan(Task::getPhaseId)) // Ensure we are comparing tasks within the same job, ordered by phase
	            .penalize(HardMediumSoftScore.ONE_HARD, (task1, task2) -> {
	                // Calculate the end time of the first task
	                LocalDateTime endTimeOfPreviousTask = task1.getStartTime().plus(task1.getPhase().getDuration());
	                
	                // Compare the start time of the next task with the end time of the previous task
	                if (task2.getStartTime().isBefore(endTimeOfPreviousTask)) {
	                    // If the next task starts before the end of the previous task, penalize the overlap
	                    return (int) Duration.between(task2.getStartTime(), endTimeOfPreviousTask).toMinutes();
	                }
	                return 0; // No penalty if the next task starts after the previous one ends
	            })
	            .asConstraint("Anteriority task constraint");
	}


	private Constraint maxCapacity(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.groupBy(Task::getStartTime, Task::getPhase, ConstraintCollectors.count())
				.filter((startTime, phase, count) -> count > phase.getCapacity())
				.penalize(HardMediumSoftScore.ONE_HARD, (startTime, phase, count) -> count - phase.getCapacity())
				.asConstraint("Max Capacity Constraint");
	}
	
	private Constraint enforceStartTimeSelection(ConstraintFactory constraintFactory) {
	    return constraintFactory.forEach(Task.class)
	            .filter(task -> task.getStartTime() == null) // Filter tasks with a null startTime
	            .penalize(HardMediumSoftScore.ONE_HARD, task -> 1) // Penalize tasks that still have null startTime
	            .asConstraint("Ensure Start Time is Assigned");
	}

	private Constraint startTimeInRange(ConstraintFactory constraintFactory) {
	    return constraintFactory.forEach(Task.class)
	            .filter(task -> task.getStartTime() != null)
	            .penalize(HardMediumSoftScore.ONE_HARD, task -> {
	                List<LocalDateTime> dateTimeRange = task.DateTimeRange();
	                if (!dateTimeRange.contains(task.getStartTime())) {
	                    return 1; // Penalize if startTime is not in the range
	                }
	                return 0; // No penalty if startTime is within range
	            })
	            .asConstraint("Start Time within DateTimeRange");
	}
	
	private Constraint noOverlappingTasksWithSameTreatment(ConstraintFactory constraintFactory) {
        // Create a constraint where tasks with the same treatment cannot have the same startTime
        return constraintFactory.forEach(Task.class)
	            .filter(task -> task.getStartTime() != null)
            .join(Task.class, 
                  Joiners.equal(Task::getStartTime)) // Same start time
            .penalize( HardMediumSoftScore.ONE_HARD, (task1, task2) ->{
            	if(!task1.getTreatment().getDescription().equalsIgnoreCase(task2.getTreatment().getDescription())) {
            		return 1; //penalize tasks with same startTime but different treatment description
            	}else {
            		return 0; //don't penalize tasks with same startTime and same treatment description
            	}
            })
            .asConstraint("No overlapping tasks with the same treatment");
    }


}
