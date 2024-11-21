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

import com.sivo.domain.Phase;
import com.sivo.request.PhaseRequest;
import com.sivo.resource.Timeslot;
import com.sivo.service.PhaseService;

@RestController
@RequestMapping("/phases")
public class PhaseController {
	
	@Autowired
	PhaseService phaseService;
	
	@PostMapping("/save")
	public ResponseEntity<Phase> createPhase(@RequestBody PhaseRequest phaseRequest) {
		return phaseService.createPhase(phaseRequest);
	}
	
	@PostMapping("/delete/{id}")
	public ResponseEntity<Phase> deletePhaseById(@PathVariable("id") long id) {
		return phaseService.deletePhaseById(id);
	}
	
	@PostMapping("/updateById/{id}")
	public ResponseEntity<Phase> updatePhase(@PathVariable("id") long id, @RequestBody Phase phase) {
		return phaseService.updatePhaseById( id, phase);
	}
	
	@GetMapping("/findById/{id}")
	public ResponseEntity<Phase> getPhaseById(@PathVariable("id") long id) {
		return phaseService.getPhaseById(id);
	}
	
	@GetMapping("/getAll")
	public ResponseEntity<List<Phase>> getAllPhase() {
		return phaseService.getAllPhases();
	}
	
	@GetMapping("/getTimeslotListByPhaseId/{id}")
	public ResponseEntity<List<Timeslot>>getTimeslotListByPhaseId(@PathVariable("id") long id) {
		return phaseService.getTimeslotListByPhaseId(id);
	}
	
}
