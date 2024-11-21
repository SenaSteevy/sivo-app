package com.sivo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.domain.Job;
import com.sivo.domain.Planning;
import com.sivo.repository.PlanningRepository;
import com.sivo.request.PlanningRequest;
import com.sivo.resource.Rate;

@Service
public class PlanningService {

	@Autowired
	PlanningRepository planningRepository;

	public ResponseEntity<List<Planning>> getAllPlannings() {

		return ResponseEntity.ok(planningRepository.findAll());
	}

	public ResponseEntity<Planning> getPlanningById(Long id) {

		Optional<Planning> planning = planningRepository.findById(id);

		if (planning.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(planning.get());
	}

	public ResponseEntity<Planning> savePlanning(PlanningRequest planningRequest) {

		Planning planning = new Planning(planningRequest);
		planning = planningRepository.save(planning);

		return ResponseEntity.ok(planning);
	}

	public ResponseEntity<Planning> deletePlanningById(Long id) {

		Optional<Planning> planning = planningRepository.findById(id);

		if (planning.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		planningRepository.deleteById(id);

		return ResponseEntity.ok().build();
	}

	public ResponseEntity<Rate> getPlanningRates(Planning planning) {
		 int totalJobs = planning.getJobList().size();
	     int lateJobs = 0;
	     int earlyJobs = 0;
	        for (Job job : planning.getJobList()) {
	           
	            if (job.getStatus().equalsIgnoreCase("DONE")  && job.getDoneAt().isAfter(job.getStartDateTime().plus(job.getLeadTime()))) {
	                lateJobs++;
	            }
	            
	            if (job.getStatus().equalsIgnoreCase("DONE")  && job.getDoneAt().isBefore(job.getStartDateTime().plus(job.getLeadTime()))) {
	            	earlyJobs++;
	        }
	    }
	        Double  lateJobsRate = (lateJobs * 100.0) / totalJobs;
		    Double earlyJobsRate = (earlyJobs*100.0) / totalJobs;
		       
		       return ResponseEntity.ok(new Rate(lateJobsRate, earlyJobsRate));
	}
}
