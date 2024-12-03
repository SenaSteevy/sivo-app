package com.sivo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sivo.domain.Treatment;
import com.sivo.request.TreatmentRequest;
import com.sivo.service.TreatmentService;

@RestController
@RequestMapping("/treatments")
@CrossOrigin
public class TreatmentController {

	
	
	@Autowired
	TreatmentService treatmentService;

	@GetMapping("/getAll")
	public ResponseEntity<List<Treatment>> getAllTreatments() {
		
		return treatmentService.getAllTreatments();
	}
	
	@GetMapping("/findById/{id}")
	public ResponseEntity<Treatment> getTreatmentById(@PathVariable Long id) {
		
		return treatmentService.getTreatmentById(id);
	}
	
	@PostMapping("/save")
	public  ResponseEntity<Treatment> saveTreatment(@RequestBody TreatmentRequest treatmentRequest ) {
		
		return treatmentService.saveTreatment(treatmentRequest);
	}
	
	@PostMapping("/delete/{id}")
	public ResponseEntity<Treatment> deleteTreatmentById(@PathVariable Long id){
		
		return treatmentService.deleteTreatmentById(id);
	}
	
	@PostMapping("/updateById/{id}")
	public ResponseEntity<Treatment> updateTreatmentById(@PathVariable Long id, @RequestBody TreatmentRequest treatmentRequest){
		
		return treatmentService.updateTreatmentById(id, treatmentRequest);
	}
	
	
}
