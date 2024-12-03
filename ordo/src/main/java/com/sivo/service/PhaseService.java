package com.sivo.service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.domain.Phase;
import com.sivo.domain.Treatment;
import com.sivo.repository.PhaseRepository;
import com.sivo.repository.TimeslotRepository;
import com.sivo.repository.TreatmentRepository;
import com.sivo.request.PhaseRequest;
import com.sivo.resource.Timeslot;

@Service
public class PhaseService {

	@Autowired
	PhaseRepository phaseRepository;

	@Autowired
	TreatmentRepository treatmentRepository;
	
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
	
	@Transactional
	public void initPhases() {
	    String[] colors = {"MONOCOLORE", "BICOLORE", "BRUN", "TEINTE", "GRIS", "BLACK", "SUN", "MARRON", "BURGUNDY", "SCOTOVUE", "QUARTZ", "LEMON", "ROSE", "ORANGE"};
	    String[] AR = {"PREVENCIA", "BLUE", "CRIZAL", "PREMIUM", "ALIZE", "SAPPHIRE", "MIRROR CX", "UV", "DRIVE", "OPTIFOG"};
	    List<String> colorations = Arrays.asList(colors);
	    List<String> typeAR = Arrays.asList(AR);

	    List<Phase> phaseList = phaseRepository.findAll();
	    List<Treatment> treatmentList = treatmentRepository.findAll();

	    if (phaseList.isEmpty() || treatmentList.isEmpty()) {
	        // Impression
	        Phase phase = createAndSavePhase("impression", 2, Duration.ofMinutes(1));
	        createAndSaveTreatment("impression", phase);

	        // Surfaçage
	        phase = createAndSavePhase("surfaçage", 80, Duration.ofHours(1));
	        createAndSaveTreatment("surfaçage", phase);

	        // Colorations
	        phase = createAndSavePhase("coloration", 15, Duration.ofMinutes(30));
	        for (String coloration : colorations) {
	            createAndSaveTreatment(coloration, phase);
	        }

	        // Resys
	        phase = createAndSavePhase("resys", 120, Duration.ofHours(2));
	        createAndSaveTreatment("SUPRA", phase);

	        // Anti-Reflet
	        phase = createAndSavePhase("anti-reflet", 165, Duration.ofHours(3));
	        for (String aR : typeAR) {
	            createAndSaveTreatment(aR, phase);
	        }

	        System.out.println("Production line was initialized to default since no phases were found in DB.");
	    }
	}

	private Phase createAndSavePhase(String name, int capacity, Duration duration) {
	    // Generate a fresh timeslot list for each phase
	    List<Timeslot> timeslotList = generateAndSaveTimeslotList();

	    // Associate timeslots with the phase before creating the phase
	    Phase phase = new Phase(name, capacity, duration, timeslotList);
	    for (Timeslot timeslot : timeslotList) {
	        timeslot.setPhase(phase); // Set the phase for each timeslot
	    }

	    // Save the phase along with the timeslots
	    return phaseRepository.save(phase);
	}

	private void createAndSaveTreatment(String name, Phase phase) {
	    Treatment treatment = new Treatment(name, phase);
	    treatmentRepository.save(treatment);
	}

	public List<Timeslot> generateAndSaveTimeslotList() {
	    List<Timeslot> timeslotList = new ArrayList<>();

	    for (DayOfWeek day : DayOfWeek.values()) {
	        if (day.getValue() >= DayOfWeek.MONDAY.getValue() && day.getValue() <= DayOfWeek.FRIDAY.getValue()) {
	            timeslotList.add(new Timeslot(day, LocalTime.of(8, 30), LocalTime.of(16, 30)));
	        } else if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
	            timeslotList.add(new Timeslot(day, LocalTime.of(8, 30), LocalTime.of(12, 30)));
	        }
	    }

	    // Persist all timeslots
	    return timeslotRepository.saveAll(timeslotList);
	}

}
