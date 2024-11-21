package com.sivo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sivo.domain.Job;
import com.sivo.request.AutoPlanningRequest;
import com.sivo.request.JobRequest;
import com.sivo.service.SchedulerService;

@RestController
public class ScheduleController {

	@Autowired
	SchedulerService schedulerService;
	
	
	@PostMapping("scheduler/updateAutoPlanning")
	public ResponseEntity<?> updateAutoPlanning(@RequestBody AutoPlanningRequest  autoPlanningRequest) {
		return schedulerService.updateAutoPlanning(autoPlanningRequest);
	}
	
	@PostMapping("scheduler/setAutoPlanning/{value}")
	public ResponseEntity<?> setAutoPlanning(@PathVariable String  value) {
		return schedulerService.setAutoPlanning(value);
	}

	@GetMapping("scheduler/getAutoPlanning")
	public ResponseEntity<?> getAutoPlanning() {
		return schedulerService.getAutoPlanning();
	}
	
	@PostMapping(value = {"scheduler/solveByExcelFile"}, consumes= {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> solveByExcelFile(@RequestParam("file") MultipartFile file){
		try {
			
			return schedulerService.solveByExcelFile(file);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.unprocessableEntity().build();
		}
	}
	
	@PostMapping("jobs/new")
	public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest) {
		return schedulerService.createJob(jobRequest);
	}

	@GetMapping("jobs/findById/{id}")
	public ResponseEntity<?> getById(@PathVariable Integer id) {

		return schedulerService.getJobById(id);
	}

	@PostMapping("jobs/updateById/{id}")
	public ResponseEntity<?> updateJob(@PathVariable Integer id, @RequestBody JobRequest jobRequest) {

		return schedulerService.updateJob(id, jobRequest);
	}

	@PostMapping("jobs/delete/{id}")
	public ResponseEntity<?> deleteById(@PathVariable Integer id) {

		return schedulerService.deleteById(id);
	}

	@GetMapping("jobs/getAll")
	public ResponseEntity<?> getAll() {

		return schedulerService.getAll();
	}

	@GetMapping("tasks/getAll")
	public ResponseEntity<?> getAllTasks() {

		return schedulerService.getAllTasks();
	}

	


	@PostMapping("/refresh-dataBase")
	public ResponseEntity<?> refreshDB() {

		try {
			return schedulerService.refreshDB();
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
		}
	}

	@GetMapping("/scheduler/solve")
	public ResponseEntity<?> solve() {

		return schedulerService.solve();

	}
	
	@PostMapping("scheduler/deleteById/{id}")
	public ResponseEntity<?> deletePlanningById(@PathVariable Long id) {

		return schedulerService.deletePlanningById(id);
	}
	
	@PostMapping("/scheduler/updateJobList")
	public ResponseEntity<?> updateJobList(@RequestBody List<Job> jobList  ){
		return schedulerService.updateJobList(jobList);
		
	}
	
	
}
