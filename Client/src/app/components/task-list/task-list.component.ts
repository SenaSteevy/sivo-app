import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Job } from 'src/models/Job';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from 'src/models/Task';
import { ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';
import { JobService } from 'src/services/jobService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements  AfterViewInit {
  @Input() jobList: Job[] = [];
  @Input() phase: any
  loading: boolean = true;
  displayedColumns: string[] = ['id', 'client', 'description', 'startTime', 'duration', 'status', 'buttons', 'actions'];

  @ViewChild("paginator", { static: false }) paginator!: MatPaginator;
  @Output() onChanges  : EventEmitter<any> = new EventEmitter()

  taskListDataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  paginatedData: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);
  selectAllChecked = false;
  public progressValues: { [taskId: string]: number } = {};

 
  constructor( private jobService : JobService, private datePipe: DatePipe ) {}

  handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const paginatedData = this.taskListDataSource.data.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Task>(paginatedData);
  }

  ngOnInit(): void {
    this.loading = true;
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.findPhasesAndDataSource();
      this.taskListDataSource.paginator = this.paginator
    });
    //look for any updates every seconds
    setInterval(() => {
      this.autoUpdateTasks()
    }, 1000);
       }

  autoUpdateTasks(){
      //progress every 1 second for task that status =="PROCESSING"
    let processingTasks = this.paginatedData.data.filter((task) => task.status ==="PROCESSING" )
    processingTasks.forEach( (task) => {
      if( moment(new Date()).isSameOrAfter(moment(task.realStartTime).add(moment.duration(task.treatment.phase.duration)))){
        this.progressValues[task.id] = moment.duration(task.treatment.phase.duration).asSeconds()
        task.status="DONE";
        this.updateTask(task);

        this.jobService.updateJobList(this.jobList).subscribe({
          next : (response : any)  => { this.findPhasesAndDataSource(); console.log("jobs Updated Successfully :",response) },
          error : (error : any ) => { console.log('error during updating jobs', error)}
         })
      }else if(!this.progressValues[task.id]){
        this.progressValues[task.id] = moment.duration(moment(new Date()).diff(moment(task.realStartTime)) ).asSeconds()
      }
      else{
        this.progressValues[task.id] +=1;
      }
    })
    
        
  }

  selectRow(checked: boolean, row: Task): void {
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }

  selectAllRows(): void {
    if (this.selectAllChecked) {
      this.selection.clear();
    } else {
      this.selection.select(...this.paginatedData.data);
    }
    this.selectAllChecked = !this.selectAllChecked;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Custom filtering function
    this.taskListDataSource.filterPredicate = (task: Task, filter: string) => {
      const numOrder = task.numOrder?.toString()
      const clientName = task.client?.name.toLowerCase();
      const status = task.status.toLowerCase();
      const startTime = moment(task.startTime).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase();      
      const description = task.treatment.description?.toLowerCase();
      return (
        numOrder?.includes(filter) ||
        clientName.includes(filter) ||
        status.includes(filter) ||
        startTime?.includes(filter) ||
        description?.includes(filter)
      );
    };
  
    // Apply the filter
    this.taskListDataSource.filter = filterValue;
  
    // Reset the paginator to the first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  
    // Update the paginatedData with the filtered data
    const startIndex = this.paginator?.pageIndex * this.paginator?.pageSize || 0;
    const endIndex = startIndex + (this.paginator?.pageSize || 10);
    const paginatedData = this.taskListDataSource.filteredData.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Task>(paginatedData);
  }
  
  
  
  

    findPhasesAndDataSource(): void {
      this.loading = true;
          this.taskListDataSource = new MatTableDataSource<Task>();
         this.jobList.forEach((job) => {
            const tasksForPhase = job.taskList.filter((task) => task.treatment.phase.name === this.phase.name)
            .map((task) => task = {...task, numOrder : job.numOrder, client : job.client } );
            this.taskListDataSource.data.push(...tasksForPhase);
          });
          
            this.paginatedData = new MatTableDataSource<Task>( this.taskListDataSource.data.slice(0, 9))
            this.loading = false

      }
  
  applyAction(action: string): void {
    const selectedTasks = this.selection.selected;
    // Apply the action to selected tasks
    switch (action) {
      case 'Start':
        this.startSelectedTasks(selectedTasks);
        break;
      case 'Stop':
        this.stopSelectedTasks(selectedTasks);
        break;
      case 'Done':
        this.completeSelectedTasks(selectedTasks);
        break;
      case 'Undone':
        this.undoSelectedTasks(selectedTasks);
        break;
    }
  }

  calculateProgress(task: any): number {
    if (task.status === 'UNDONE') {
      return 0;
    } else if (task.status === 'PROCESSING') {
      const progress = (this.progressValues[task.id] / moment.duration(task.phase.duration).asSeconds()) * 100;
      return progress;
    } else {
      return 100;
    }
  }
  
      undoSelectedTasks(tasks: Task[]): void {
        tasks.forEach((task) => {
          task = {...task, status : "UNDONE",
           realStartTime : undefined};
          
           this.updateTask(task) } )  

           this.jobService.updateJobList(this.jobList).subscribe({
            next : (response : any)  => { this.findPhasesAndDataSource(); console.log("jobs Updated Successfully :",response) },
            error : (error : any ) => { console.log('error during updating jobs', error)}
           })
      }
      

      startSelectedTasks(tasks: Task[]): void {
        tasks.forEach((task) => {
          task = {...task, status : "PROCESSING",
            realStartTime : this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')?.toString() }
          this.progressValues[task.id] = 0
          this.updateTask(task) } )
           

           this.jobService.updateJobList(this.jobList).subscribe({
            next : (response : any)  => { this.findPhasesAndDataSource(); console.log("jobs Updated Successfully :",response) },
            error : (error : any ) => { console.log('error during updating jobs', error)}
           })
           
      }
      
      
      stopSelectedTasks(tasks: Task[]): void {
        tasks.forEach((task) => {
          task = {...task, status : "UNDONE",
           realStartTime : undefined};
           this.progressValues[task.id] = 0
           this.updateTask(task) } )     
           this.jobService.updateJobList(this.jobList).subscribe({
            next : (response : any)  => {this.findPhasesAndDataSource(); console.log("jobs Updated Successfully :",response) },
            error : (error : any ) => { console.log('error during updating jobs', error)}
           })
         }
      
      completeSelectedTasks(tasks: Task[]): void {
        tasks.forEach((task) => {
          task = {...task, status : "DONE"};
          this.progressValues[task.id] = moment.duration(task.treatment.phase.duration).asMinutes();
           this.updateTask(task) } )    
          this.jobService.updateJobList(this.jobList).subscribe({
            next : (response : any)  => { this.findPhasesAndDataSource(); console.log("jobs Updated Successfully :",response) },
            error : (error : any ) => { console.log('error during updating jobs', error)}
           })
        }

      updateTask(updatedTask: Task) {
        // Find the corresponding job in the jobList
        const job = this.jobList.find(j => j.taskList.some(t => t.id === updatedTask.id));
    
        if (job) {
          // Find the index of the task in the taskList of the job
          const taskIndex = job.taskList.findIndex(t => t.id === updatedTask.id);
    
          if (taskIndex !== -1) {
            // Update the task with the new values
            job.taskList[taskIndex] = updatedTask;
          } else {
            console.log('Task not found in the taskList of the job.');
          }
        } else {
          console.log('Job not found in the jobList.');
        }
      }

      
}
