package com.sivo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sivo.domain.Planning;
import com.sivo.request.PlanningRequest;
import com.sivo.resource.Rate;
import com.sivo.service.PlanningService;

@RestController
@RequestMapping("/plannings")
public class PlanningController {

	
	
	@Autowired
	PlanningService planningService;


	@GetMapping("/getAll")
	public ResponseEntity<List<Planning>> getAllPlannings() {
		
		return planningService.getAllPlannings();
	}
	
	@GetMapping("/findById/{id}")
	public ResponseEntity<Planning> getPlanningById(@PathVariable Long id) {
		
		return planningService.getPlanningById(id);
	}
	
	@PostMapping("/save")
	public  ResponseEntity<Planning> savePlanning(@RequestBody PlanningRequest planningRequest ) {
		
		return planningService.savePlanning(planningRequest);
	}
	
	@PostMapping("/delete/{id}")
	public ResponseEntity<Planning> deletePlanningById(@PathVariable Long id){
		
		return planningService.deletePlanningById(id);
	}
	
	@GetMapping("/getPlanningRates")
	public ResponseEntity<Rate> getById(@RequestBody Planning planning) {

		return planningService.getPlanningRates(planning);
		
	}
	
	
}
