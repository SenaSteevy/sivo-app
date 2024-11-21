package com.sivo.domain;


import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.sivo.request.PlanningRequest;

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
@Table(name = "Planning")
public class Planning {
	
	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "JOBS_PLANNING", joinColumns = { @JoinColumn(name = "JOB_ID") }, inverseJoinColumns = {
			@JoinColumn(name = "PLANNING_ID") })
	private List<Job> jobList;
	
	@Column( name = "rxRate")
	private Double rxRate;
	
	@Column( name = "dueDateRate")
	private Double dueDateRate ;
	
	@Column(name ="createdAt")
	private LocalDateTime createdAt;
	
	public Planning(PlanningRequest planningRequest) {
		
		this.jobList = planningRequest.getJobList();
		this.dueDateRate = getDueDateRate(planningRequest.getJobList());
		this.rxRate = getRxRate(planningRequest.getJobList());
		this.createdAt = LocalDateTime.now();  //A modifier pour la simulation
		
	}


    public static double getRxRate(List<Job> jobs) {
        int totalJobs = jobs.size();
        int jobsWithin24Hours = 0;

        for (Job job : jobs) {
           
            if (job.getLeadTime().toHours() < 24) {
                jobsWithin24Hours++;
            }
        }

        return (jobsWithin24Hours * 100.0) / totalJobs;
    }
    
    public static double getDueDateRate(List<Job> jobs) {
        int totalJobs = jobs.size();
        int jobsWithEndTimeBeforeDueDate = 0;

        for (Job job : jobs) {
           
            if (job.getStartDateTime().plus(job.getLeadTime()).isBefore(job.getDueDate())) {
                jobsWithEndTimeBeforeDueDate++;
            }
        }

        return (jobsWithEndTimeBeforeDueDate * 100.0) / totalJobs;
    }

	public Planning(List<Job> jobList) {
		this.rxRate = getRxRate(jobList);
		this.dueDateRate = getDueDateRate(jobList);
		this.jobList = jobList;
		this.createdAt = LocalDateTime.now();	}
}

	
