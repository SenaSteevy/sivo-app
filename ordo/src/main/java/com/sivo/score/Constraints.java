package com.sivo.score;

import java.time.Duration;
import java.time.LocalDateTime;

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
				minimizeTimeGapBetweenTasks(constraintFactory)
		};
	}

	private Constraint ResourceShouldBefull(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.groupBy(Task::getStartTime, Task::getPhase, ConstraintCollectors.count())
				.filter((startTime, phase, count) -> count <= phase.getCapacity())
				.penalize(HardMediumSoftScore.ONE_MEDIUM, (startTime, phase, count) -> phase.getCapacity() - count)
				.asConstraint("Resource should be full");
	}
	
	private Constraint minimizeTimeGapBetweenTasks(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.filter(task -> task.getPhase().getId() > 0) // considérer uniquement les tâches avec des phases non-nulles
		        .filter(task -> task.getStartTime() != null) // considérer uniquement les tâches avec une heure de début non-nulle
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
				.filter(task -> task.getPhase().getId() > 0) // considérer uniquement les tâches avec des phases non-nulles
                .filter(task -> task.getStartTime() != null) // considérer uniquement les tâches avec une heure de début non-nulle
                .join(Task.class,
                    Joiners.equal(Task::getJob),
                    Joiners.lessThan(Task::getPhaseId))
                .penalize( HardMediumSoftScore.ONE_HARD, (task1, task2) -> 
                    task2.getStartTime().compareTo(task1.getStartTime().plus(task1.getPhase().getDuration())) > 0 ? 0 : 1)
                .asConstraint("anteriority task constraint");
	}

	private Constraint maxCapacity(ConstraintFactory constraintFactory) {
		return constraintFactory.forEach(Task.class)
				.groupBy(Task::getStartTime, Task::getPhase, ConstraintCollectors.count())
				.filter((startTime, phase, count) -> count > phase.getCapacity())
				.penalize(HardMediumSoftScore.ONE_HARD, (startTime, phase, count) -> count - phase.getCapacity())
				.asConstraint("Max Capacity Constraint");
	}

}
