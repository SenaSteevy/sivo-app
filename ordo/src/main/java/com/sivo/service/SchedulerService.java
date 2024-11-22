package com.sivo.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sivo.domain.Job;
import com.sivo.domain.Phase;
import com.sivo.domain.Planning;
import com.sivo.domain.Schedule;
import com.sivo.domain.Task;
import com.sivo.domain.Treatment;
import com.sivo.repository.AutoPlanningRepository;
import com.sivo.repository.JobRepository;
import com.sivo.repository.PhaseRepository;
import com.sivo.repository.PlanningRepository;
import com.sivo.repository.TaskRepository;
import com.sivo.repository.TreatmentRepository;
import com.sivo.request.JobRequest;

@Service
@Transactional
public class SchedulerService {

	@Autowired
	AutoPlanningRepository autoPlanningRepository;

	@Autowired
	JobRepository jobRepository;

	@Autowired
	TaskRepository taskRepository;

	@Autowired
	TreatmentRepository treatmentRepository;

	@Autowired
	PhaseRepository phaseRepository;

	@Autowired
	PlanningRepository planningRepository;



	String[] colors = { "MONOCOLORE", "BICOLORE", "BRUN", "TEINTE", "GRIS", "BLACK", "SUN", "MARRON", "BURGUNDY",
			"SCOTOVUE", "QUARTZ", "LEMON", "ROSE", "ORANGE" };
	List<String> colorations = new ArrayList<String>(Arrays.asList(colors));

	String[] AR = { "PREVENCIA", "BLUE", "CRIZAL", "PREMIUM", "ALIZE", "SAPPHIRE", "MIRROR CX", "UV", "DRIVE",
			"OPTIFOG" };
	List<String> typeAR = new ArrayList<String>(Arrays.asList(AR));

	Phase impression;
	Phase surfacage;
	Phase coloration;
	Phase resys;
	Phase antiReflet;


	public Schedule solve(Schedule problem) {

		// Submit the problem to start solving
		SolverConfig solverConfig = SolverConfig.createFromXmlResource("solverConfig.xml");
		// solverConfig.withTerminationConfig(new
		// TerminationConfig().withMinutesSpentLimit((long) 60));

		SolverFactory<Schedule> solverFactory = SolverFactory.create(solverConfig);
		Solver<Schedule> solver = solverFactory.buildSolver();

		Schedule solution;
		try {
			// Wait until the solving ends
			solution = solver.solve(problem);
		} catch (Exception e) {
			throw new IllegalStateException("Solving failed.", e);
		}
		return solution;
	}

	public ResponseEntity<?> solve() {
		List<Task> taskList = taskRepository.findByStatusIgnoreCaseLike("UNDONE");

		// Check the initial task list size
		System.out.println("Initial taskList size: " + taskList.size());

		// Delete tasks with no dueDate to clean the database
		for (Task task : taskList) {
			if (task.getJob() == null || task.getJob().getDueDate() == null) {
				System.out.println("Deleting task due to null job or null due date: " + task);
				taskRepository.delete(task);
			}
		}

		// Filter the task list for tasks with valid jobs and due dates
		taskList = taskList.stream().filter(task -> task.getJob() != null && task.getJob().getDueDate() != null)
				.collect(Collectors.toList());

		System.out.println("Filtered taskList size: " + taskList.size());

		if (taskList.isEmpty()) {
			System.out.println("taskList empty");
			return ResponseEntity.notFound().build();
		}

		// Reset the start time of each task
		taskList.forEach(task -> {
			task.setStartTime(null);
		});

		// Attempt to solve scheduling
		Schedule bestSolution = solve(new Schedule(taskList));
		if (bestSolution == null) {
			System.out.println("No solution found from the solve() method.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No solution found");
		}

		// Update and save each job with the best solution tasks
		for (Task task : bestSolution.getTasks()) {
			Job job = task.getJob();
			if (job != null) {
				job.updateTask(task);
				jobRepository.save(job);
			}
		}

		// Retrieve the planning jobs
		List<Job> planning = getJobList(bestSolution);

		if (planning.isEmpty()) {
			System.out.println("planning is empty");
		}

		// Save the planning jobs and return the result
		Planning solution = new Planning(planning);
		solution = planningRepository.save(solution);
		System.out.println("PLANNING DONE: ");
		return ResponseEntity.ok().body(solution);
	}

	public ResponseEntity<?> createJob(JobRequest jobRequest) {
		System.out.println(jobRequest);
		Optional<Job> optionalJob = jobRepository.findById(jobRequest.getNumOrder());
		if (optionalJob.isPresent()) {
			return ResponseEntity.ok().build();
		}

		Job job = new Job(jobRequest);

		if (jobRequest.getTaskList() != null) {

			// Add new tasks while maintaining the same collection instance
			for (Task task : jobRequest.getTaskList()) {
				task.setJob(job); // Set the relationship
				job.getTaskList().add(task); // Add directly to the existing collection
			}
		}

		job = jobRepository.save(job);
		return ResponseEntity.ok().body(job);
	}

	public ResponseEntity<?> updateJob(Integer id, JobRequest jobRequest) {
		Optional<Job> jobOptional = jobRepository.findById(id);
		if (jobOptional.isPresent()) {
			Job existingJob = jobOptional.get();
			Job updatedJob = new Job(jobRequest);

			// Update the properties of existingJob from updatedJob
			existingJob.setCodeOrder(updatedJob.getCodeOrder());
			existingJob.setDescription(updatedJob.getDescription());
			existingJob.setSupplement(updatedJob.getSupplement());
			existingJob.setType(updatedJob.getType());
			existingJob.setDueDate(updatedJob.getDueDate());
			existingJob.setLeadTime(updatedJob.getLeadTime());
			existingJob.setPriority(updatedJob.getPriority());
			existingJob.setCreatedAt(updatedJob.getCreatedAt());
			existingJob.setDoneAt(updatedJob.getDoneAt());
			existingJob.setStartDateTime(updatedJob.getStartDateTime());
			existingJob.setStatus(updatedJob.getStatus());

			// Manage tasks
			existingJob.getTaskList().clear(); // Clear existing tasks
			if (jobRequest.getTaskList() != null) {
				for (Task task : jobRequest.getTaskList()) {
					existingJob.addTask(task); // Add and link each task to job
				}
			}

			Job savedJob = jobRepository.save(existingJob);
			return ResponseEntity.ok().body(savedJob);
		}

		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<?> deleteById(Integer id) {

		Optional<Job> job = jobRepository.findById(id);
		if (job.isPresent()) {

//			 List<Planning> planningList = planningRepository.findAll();
//			 planningList.stream().map( planning ->  planning.getJobList().remove(job.get()));
//			 
//			 planningRepository.saveAll(planningList);
			jobRepository.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<?> getAll() {

		return ResponseEntity.ok().body(jobRepository.findAll());
	}


//	private void resetPhases() {
//		impression = createPhase("impression", 2, Duration.ofMinutes(2));
//		surfacage = createPhase("surfaçage", 160, Duration.ofHours(2));
//		coloration = createPhase("coloration", 15, Duration.ofMinutes(30));
//		resys = createPhase("resys", 120, Duration.ofHours(2));
//		antiReflet = createPhase("anti-reflet", 165, Duration.ofHours(3));
//	}

	private List<Job> getJobList(Schedule schedule) {
		List<Job> planning = schedule.getTasks().stream()
				.filter(task -> "impression".equalsIgnoreCase(task.getPhase().getName()))
				.sorted(Comparator.comparing(Task::getStartTime)).map(Task::getJob).distinct() // Ensure unique Jobs are
																								// collected
				.collect(Collectors.toList());

		for (Job job : planning) {
			List<Task> tasks = schedule.getTasks().stream().filter(task -> task.getJob().equals(job))
					.sorted(Comparator.comparingInt(Task::getPhaseId)).collect(Collectors.toList());

			if (!tasks.isEmpty()) {
				LocalDateTime startDateTime = tasks.get(0).getStartTime();
				job.setStartDateTime(startDateTime);

				// Remove individual tasks to avoid orphan-related exceptions
				Iterator<Task> iterator = job.getTaskList().iterator();
				while (iterator.hasNext()) {
					Task task = iterator.next();
					if (!tasks.contains(task)) {
						iterator.remove();
					}
				}

				// Add or update tasks in the existing taskList collection
				tasks.forEach(task -> {
					if (!job.getTaskList().contains(task)) {
						job.getTaskList().add(task);
					}
				});

				OptionalInt maxPhaseId = tasks.stream().mapToInt(Task::getPhaseId).max();

				if (maxPhaseId.isPresent()) {
					Task maxPhaseTask = tasks.stream().filter(task -> task.getPhaseId() == maxPhaseId.getAsInt())
							.findFirst().orElse(null);

					if (maxPhaseTask != null && maxPhaseTask.getStartTime() != null) {
						LocalDateTime endDateTime = maxPhaseTask.getStartTime()
								.plus(maxPhaseTask.getPhase().getDuration());
						job.setLeadTime(Duration.between(startDateTime, endDateTime));
					}
				}

				// Save the updated job
				jobRepository.save(job);
			}
		}

		return planning;
	}

	private List<Task> getTaskList(int numOrder, Row row, String supplement) {
		List<Task> taskList = new ArrayList<Task>();

		// impression
		Treatment treatment = treatmentRepository.findByPhaseName("impression").get(0);
		taskList.add(new Task(treatment));

		// surfacage
		if (row.getCell(3).getStringCellValue().contains("F")) {
			treatment = treatmentRepository.findByPhaseName("surfaçage").get(0);
			taskList.add(new Task(treatment));
		}

		List<Treatment> treatments = new ArrayList<Treatment>();
		// coloration
		for (String color : colorations)
			if (supplement.toUpperCase().contains(color)) {
				treatments = treatmentRepository.findByPhaseName("coloration");

				Optional<Treatment> optionalTreatment = treatments.stream()
						.filter(item -> item.getDescription().equalsIgnoreCase(color)).findFirst();

				if (optionalTreatment.isEmpty()) {
					taskList.add(new Task(treatments.get(0)));
				} else {
					taskList.add(new Task(optionalTreatment.get()));
				}
				break;
			}

		// resys
		if (supplement.toUpperCase().contains("SUPRA"))

		{

			treatment = treatmentRepository.findByPhaseName("resys").get(0);
			taskList.add(new Task(treatment));
		}

		// AR
		for (String type : typeAR)
			if (supplement.toUpperCase().contains(type)) {
				treatments = treatmentRepository.findByPhaseName("anti-reflet");
				if (!treatments.isEmpty()) {

					Optional<Treatment> optionalTreatment = treatments.stream()
							.filter(item -> item.getDescription().equalsIgnoreCase(type)).findFirst();

					if (optionalTreatment.isEmpty()) {
						taskList.add(new Task(treatments.get(0)));
					} else {
						taskList.add(new Task(optionalTreatment.get()));
					}
					break;
				}
			}
		return taskList;
	}

	public LocalDateTime getLocalDateTime(Cell cell) {

		// Try to parse the cell value as a LocalDateTime object.
		try {
			// If the cell value is a numeric cell, use the Apache POI `DateUtil` class to
			// parse the cell value.

			Date javaDate = DateUtil.getJavaDate(cell.getNumericCellValue());
			return LocalDateTime.ofInstant(javaDate.toInstant(), ZoneId.systemDefault());

		} catch (Exception e) {
			// If the cell value cannot be parsed as a LocalDateTime object, return null.
			return null;
		}
	}

	public ResponseEntity<?> getAllTasks() {

		return ResponseEntity.ok(taskRepository.findAll());
	}

	public ResponseEntity<?> getJobById(Integer id) {

		Optional<Job> job = jobRepository.findById(id);
		if (job.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(job.get());
	}

	public ResponseEntity<?> updateJobList(List<Job> jobList) {

		try {
			for (Job job : jobList)
				updateJob(job.getNumOrder(), new JobRequest(job));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		return ResponseEntity.ok().build();
	}


	private int taskId;

	public ResponseEntity<?> solveByExcelFile(MultipartFile file) throws IOException {

		System.out.println("Debut de l'extraction ...");

		InputStream inputStream = file.getInputStream();
		// Use a lightweight Excel library.
		Workbook workbook = new XSSFWorkbook(inputStream);

		// Get a reference to the first sheet in the workbook.
		Sheet sheet = workbook.getSheetAt(0);

		// Remove the header row.
		sheet.removeRow(sheet.getRow(0));

		// Create a list to store the jobs.
		List<Job> jobs = new ArrayList<>();
		List<Task> taskList = new ArrayList<>();
		// Iterate over the rows in the sheet and create a job object for each row.
		this.taskId = 0;
		for (int i = 1; i <= sheet.getPhysicalNumberOfRows(); i++) {
			Row row = sheet.getRow(i);
			if (row.getCell(1).getStringCellValue().equals("")) {
				break;
			}
			Job job = new Job();

			// Set the job code, description, supplement, type, due date, priority, status,
			// and created date.
			job.setNumOrder(Integer.parseInt(row.getCell(1).getStringCellValue()));
			job.setCodeOrder(row.getCell(4).getStringCellValue());
			job.setDescription(row.getCell(5).getStringCellValue());
			job.setSupplement(row.getCell(7).getStringCellValue());
			job.setType(row.getCell(3).getStringCellValue());
			job.setCreatedAt(getLocalDateTime(row.getCell(8)));

			LocalDateTime dueDate = getLocalDateTime(row.getCell(19));
			if (dueDate == null) {
				dueDate = job.getCreatedAt().plusDays(2);
			}
			job.setDueDate(dueDate);
			job.setPriority(1);
			job.setStatus("UNDONE");

			// Get the task list for the job.
			List<Task> tasks = getTaskList(0, row, job.getSupplement());
			tasks.stream().forEach(item -> {
				item.setJob(job);
				item.setId(this.taskId);
				this.taskId++;
			});
			taskList.addAll(tasks);
			// Set the time range start time for each task in the job.
			tasks.stream().forEach(item -> item.setTimeRangeStartTime(job.getCreatedAt()));

			// Add the tasks to the job.
			job.setTaskList(tasks);

			// Add the job to the list of jobs.
			jobs.add(job);
			System.out.println("row " + i + " Done");

		}

		// Close the FileInputStream object.
		inputStream.close();

		// Close the Excel file.
		workbook.close();

		System.out.println("Extraction des données : OK");
		System.out.println("total jobs extracted : " + jobs.size());
		System.out.println("job.duedate : " + jobs.get(0).getDueDate());
		System.out.println("Début du Calcul...");

		Schedule schedule = new Schedule(taskList);
		schedule = solve(schedule);
		System.out.println("Calcul : OK");
		System.out.println("Début de la création du fichier Excel");
		List<Job> planning = getJobList(schedule);
		
		List<Task> emptyTasks = new ArrayList<Task>();
		planning.stream().forEach(job ->  emptyTasks.addAll(job.getTaskList().stream().filter(task -> task.getStartTime() ==null).collect(Collectors.toList())));
		
		//emptyTasks.stream().forEach(task -> System.out.println(task) );
		
				try {
			return exportTaskList(planning, "response");
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	public ResponseEntity<byte[]> exportTaskList(List<Job> jobList, String fileName) throws IOException {
		Workbook workbook = new XSSFWorkbook();
		Sheet sheet = workbook.createSheet("Orders");

		// Créer un tableau pour contenir les données
		Row headerRow = sheet.createRow(0);

		// Ajouter les colonnes au tableau
		Cell cell = headerRow.createCell(0);
		cell.setCellValue("NUM ORDER");
		cell = headerRow.createCell(1);
		cell.setCellValue("CODE ORDER");
		cell = headerRow.createCell(2);
		cell.setCellValue("TYPE");
		cell = headerRow.createCell(3);
		cell.setCellValue("DESCRIPTION");
		cell = headerRow.createCell(4);
		cell.setCellValue("SUPPLEMENT");
		cell = headerRow.createCell(5);
		cell.setCellValue("DATE CREATION");
		cell = headerRow.createCell(6);
		cell.setCellValue("DUEDATE");
		cell = headerRow.createCell(7);
		cell.setCellValue("DEBUT IMPRESSION");
		cell = headerRow.createCell(8);
		cell.setCellValue("DEBUT SURFACAGE");
		cell = headerRow.createCell(9);
		cell.setCellValue("DEBUT COLORATION");
		cell = headerRow.createCell(10);
		cell.setCellValue("DEBUT RESYS");
		cell = headerRow.createCell(11);
		cell.setCellValue("DEBUT ANTI-REFLET");
		cell = headerRow.createCell(12);
		cell.setCellValue("DATE DE FIN");
		cell = headerRow.createCell(13);
		cell.setCellValue("DUREE ");

		// Ajouter les données de la liste de tâches au tableau
		int rowCount = 1;
		for (Job job : jobList) {

			Row row = sheet.createRow(rowCount);

			cell = row.createCell(0);
			cell.setCellValue(job.getNumOrder());
			cell = row.createCell(1);
			cell.setCellValue(job.getCodeOrder());
			cell = row.createCell(2);
			cell.setCellValue(job.getType());
			cell = row.createCell(3);
			cell.setCellValue(job.getDescription());
			cell = row.createCell(4);
			cell.setCellValue(job.getSupplement());
			cell = row.createCell(5);
			cell.setCellValue(parseLocalDateTime(job.getCreatedAt()));
			cell = row.createCell(6);
			cell.setCellValue(parseLocalDateTime(job.getDueDate()));

			List<Task> tasks = job.getTaskList().stream().sorted(Comparator.comparingInt(Task::getPhaseId))
					.collect(Collectors.toList());
			Optional<Task> task;

			// DebutImpression
			cell = row.createCell(7);
			cell.setCellValue(parseLocalDateTime(tasks.get(0).getStartTime()));

			// DebutSurfacage
			cell = row.createCell(8);
			task = tasks.stream().filter(item -> item.getTreatment().getPhase().getName().equalsIgnoreCase("surfaçage"))
					.findAny();
			if (task.isPresent()) {
				cell.setCellValue(parseLocalDateTime(task.get().getStartTime()));
			}

			// DebutColoration
			cell = row.createCell(9);
			task = tasks.stream()
					.filter(item -> item.getTreatment().getPhase().getName().equalsIgnoreCase("coloration")).findAny();
			if (task.isPresent()) {
				cell.setCellValue(parseLocalDateTime(task.get().getStartTime()));
			}

			// DebutResys
			cell = row.createCell(10);
			task = tasks.stream().filter(item -> item.getTreatment().getPhase().getName().equalsIgnoreCase("resys"))
					.findAny();
			if (task.isPresent()) {
				cell.setCellValue(parseLocalDateTime(task.get().getStartTime()));
			}

			// DebutAR
			cell = row.createCell(11);
			task = tasks.stream()
					.filter(item -> item.getTreatment().getPhase().getName().equalsIgnoreCase("anti-reflet")).findAny();
			if (task.isPresent()) {
				cell.setCellValue(parseLocalDateTime(task.get().getStartTime()));
			}

			// DateFin
			cell = row.createCell(12);
			cell.setCellValue(parseLocalDateTime(job.getStartDateTime().plus(job.getLeadTime())));

			// LeadTime
			cell = row.createCell(13);
			cell.setCellValue(job.getLeadTime().toHoursPart() + " h " + job.getLeadTime().toMinutesPart() + " min "
					+ job.getLeadTime().toSecondsPart() + " s ");

			rowCount++;
			System.out.println("row " + rowCount + " added");
		}

		for (int i = 0; i <= 13; i++) {
			sheet.autoSizeColumn(i);
		}

		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		workbook.write(byteArrayOutputStream);
		workbook.close();

		return ResponseEntity.ok()
				.contentType(
						MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
				.header("Content-Disposition", "attachment;filename=Result.xlsx")
				.body(byteArrayOutputStream.toByteArray());
	}

	private String parseLocalDateTime(LocalDateTime localDateTime) {

		DecimalFormat decimalFormat = new DecimalFormat("00");
		return decimalFormat.format(localDateTime.getDayOfMonth()) + "/"
				+ decimalFormat.format(localDateTime.getMonthValue()) + "/" + localDateTime.getYear() + " "
				+ decimalFormat.format(localDateTime.getHour()) + ":" + decimalFormat.format(localDateTime.getMinute())
				+ ":" + decimalFormat.format(localDateTime.getSecond());
	}



	public ResponseEntity<?> deletePlanningById(Long id) {

		Optional<Planning> planning = planningRepository.findById(id);
		if (planning.isPresent()) {
			planningRepository.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
}
