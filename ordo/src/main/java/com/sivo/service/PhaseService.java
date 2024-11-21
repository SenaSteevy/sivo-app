package com.sivo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.domain.Phase;
import com.sivo.repository.PhaseRepository;
import com.sivo.repository.TimeslotRepository;
import com.sivo.request.PhaseRequest;
import com.sivo.resource.Timeslot;

@Service
public class PhaseService {

	@Autowired
	PhaseRepository phaseRepository;

	@Autowired
	TimeslotRepository timeslotRepository;

	public ResponseEntity<List<Phase>> getAllPhases() {
		List<Phase> phases = phaseRepository.findAll();
		return ResponseEntity.ok(phases);
	}

	public ResponseEntity<Phase> getPhaseById(long phaseId) {
		Phase phase = phaseRepository.findById(phaseId).orElse(null);
		if (phase != null) {
			return ResponseEntity.ok(phase);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	public ResponseEntity<Phase> createPhase(PhaseRequest phaseRequest) {
		
		Phase phase = new Phase(phaseRequest);
		phase = phaseRepository.save(phase);
		
		for (Timeslot timeslot : phase.getTimeslotList()) {
			 timeslot = timeslotRepository.save(timeslot);
		}
		 
		

		return ResponseEntity.ok(phase);
	}

	public ResponseEntity<Phase> updatePhaseById(Long id,Phase phase) {
		
		Phase existingPhase = phaseRepository.findById(id).orElse(null);
		if (existingPhase != null) {
			existingPhase.setName(phase.getName());
			existingPhase.setCapacity(phase.getCapacity());
			existingPhase.setDuration(phase.getDuration());

			List<Timeslot> existingTimeslots = existingPhase.getTimeslotList();
			List<Timeslot> newTimeslots = phase.getTimeslotList();

			for (Timeslot existingTimeslot : existingTimeslots) {
					timeslotRepository.delete(existingTimeslot);
			}
			
			for (Timeslot newTimeslot : newTimeslots) {
				timeslotRepository.save(newTimeslot);
			}
			
			existingPhase.setTimeslotList(newTimeslots);

			Phase updatedPhase = phaseRepository.save(existingPhase);

			return ResponseEntity.ok(updatedPhase);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	public ResponseEntity<Phase> deletePhaseById(long phaseId) {
		Phase phase = phaseRepository.findById(phaseId).orElse(null);
		if (phase != null) {
			List<Timeslot> timeslots = phase.getTimeslotList();
			for (Timeslot timeslot : timeslots) {
				timeslotRepository.delete(timeslot);
			}
			phaseRepository.delete(phase);

			return ResponseEntity.ok(phase);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	public ResponseEntity<List<Timeslot>> getTimeslotListByPhaseId(long id) {
		
		Optional<Phase> phase = phaseRepository.findById(id);
		
		if(phase.isEmpty())
			return ResponseEntity.notFound().build();
		
		return ResponseEntity.ok(phase.get().getTimeslotList());
	}
}
