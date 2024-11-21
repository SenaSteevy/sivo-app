package com.sivo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.domain.Treatment;
import com.sivo.repository.TreatmentRepository;
import com.sivo.request.TreatmentRequest;

@Service
public class TreatmentService {
	
	@Autowired
	TreatmentRepository treatmentRepository;

	public ResponseEntity<List<Treatment>> getAllTreatments() {
		
		List<Treatment> treatments = treatmentRepository.findAll();
		return ResponseEntity.ok(treatments);
	}

	public ResponseEntity<Treatment> getTreatmentById(Long id) {
		
		Optional<Treatment> treatment = treatmentRepository.findById(id);
		if(treatment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(treatment.get());
	}

	public ResponseEntity<Treatment> saveTreatment(TreatmentRequest treatmentRequest) {
	
		List<Treatment> treatmentList = treatmentRepository.findByDescription(treatmentRequest.getDescription());
		if(!treatmentList.isEmpty()) 
			return ResponseEntity.ok().build();
			
		Treatment treatment = new Treatment(treatmentRequest);
		treatment = treatmentRepository.save(treatment);
		
		return ResponseEntity.ok(treatment);
	}

	public ResponseEntity<Treatment> deleteTreatmentById(Long id) {
		
		Optional<Treatment> treatment = treatmentRepository.findById(id);
		if(treatment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		treatmentRepository.deleteById(id);
		return ResponseEntity.ok().build();
		
		
	}

	public ResponseEntity<Treatment> updateTreatmentById(Long id, TreatmentRequest treatmentRequest) {
		
		Optional<Treatment> treatment = treatmentRepository.findById(id);
		if(treatment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Treatment updatedTreatment = new Treatment(treatmentRequest);
		updatedTreatment.setId(id);
		updatedTreatment = treatmentRepository.save(updatedTreatment);
		return ResponseEntity.ok(updatedTreatment);
		
	}

}
