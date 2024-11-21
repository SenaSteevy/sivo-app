import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Client } from 'src/models/Client';
import { Job } from 'src/models/Job';
import { JobService } from 'src/services/jobService';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class OrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select','numOrder', 'client', 'createdAt', 'dueDate', 'status'];
  displayedColumnsWithExpand : string[] = [...this.displayedColumns, 'expand']
  ordersDataSource: MatTableDataSource<Job> = new MatTableDataSource<Job>();
  paginatedData: MatTableDataSource<Job> = new MatTableDataSource<Job>();
  @ViewChild(MatPaginator) paginator: any;
  
  state : 'loading' | 'error' | 'ready' = 'loading';
  selection = new SelectionModel<Job>(true, []);
  selectAllChecked = false;

  dueDateRate: any;
  doneRate: any;
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;
  @ViewChild('carousel') carousel: any;
  isFirstContent : boolean = true
  generating : boolean = true;
  jobList: Job[] = [];

  selectedMonth: string = moment().format('MMM');
  selectedYear: string = moment().format('MMM');
  months: string[] = []; // populate with available months
  years: string[] = []; // populate with available years
  chart: any;
  expandedElement: Job | null = null;

  toggleExpandRow(element: Job): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
  
  
  isRowExpanded(job: Job): boolean {
    return this.expandedElement === job;
  }
  slidePrev() {
    this.carousel.nativeElement.style.transform = 'translateX(0%)';
    this.isFirstContent = true
  }

  slideNext() {
    this.carousel.nativeElement.style.transform = 'translateX(-50%)';
    this.isFirstContent = false
  }

  constructor(private router: Router, 
    private jobService: JobService, 
    private renderer: Renderer2, 
    private elementRef: ElementRef,
    private dialog : MatDialog,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.getDataSource();
    this.ordersDataSource.paginator = this.paginator; 

  }

  changeLineChart(){
    this.generating = true;
    setTimeout(() => {
            this.generateLineChart(this.selectedMonth, parseInt( this.selectedYear)); // Generate chart after a small delay
          }, 0);  
    this.generating = false; 
        }

  populateMonthsAndYears(): void {
    const jobsPerDay = this.calculateJobsPerDay();
    this.months = [];
    this.years = [];

    for (const jobType in jobsPerDay) {
      for (const year in jobsPerDay[jobType]) {
        if(!this.years.includes(year)){
          this.years.push(year);
        }
        for (const month in jobsPerDay[jobType][year]) {
          if (!this.months.includes(month)) {
            this.months.push(month);
          }
        }
      }
    }
    if(!this.months.includes(this.selectedMonth)){
      this.selectedMonth = this.months[0]
    }

    if(!this.years.includes(this.selectedYear)){
      this.selectedYear = this.years[0]
    }

  }

 
  

  getDataSource() {
    this.jobService.getJobs().subscribe({
      next: (response: Job[]) => {
        this.ordersDataSource.data.push(...response);
        this.paginatedData = new MatTableDataSource<Job>( this.ordersDataSource.data.slice(0, 10))
        this.jobList = response
        this.state = 'ready';
      },
      error: (error: any) => {
        console.log('error during getAllJobs:', error);
        this.state= 'error';
      },
      complete : async () => {
        this.ordersDataSource.paginator = this.paginator;
          this.populateMonthsAndYears()
          this.getDoneRate();
          this.getDueDateRate();
          setTimeout(() => {
            this.generateLineChart(this.selectedMonth, parseInt( this.selectedYear)); // Generate chart after a small delay
          }, 0);   
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const paginatedData = this.ordersDataSource.data.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Job>(paginatedData);
  }

  selectRow(checked: boolean, row: Job): void {
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }
  applyAction(action: string): void {
    const selectedJobs = this.selection.selected;
    // Apply the action to selected tasks
    switch (action) {
      case 'Delete':
        this.deleteJobs(selectedJobs);
  
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

  deleteJobs(job: Job[]): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete Jobs ?", content : `Are you sure you want to delete these jobs ?`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){
      let errors = 0;
      job.forEach((job) => {
        this.jobService.deleteJob(job.numOrder).subscribe({
          error : (error : any ) => {
            console.log("error during deleting job :"+job.description, error) 
            errors++}
        })    
      })
      if(errors == 0){ 
        setTimeout(()=>{
          this.getDataSource();
        this.openSnackBar("Job list selected was deleted successfully.")
        }, 3000)
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Custom filtering function
    this.ordersDataSource.filterPredicate = (job: Job, filter: string) => {
      const numOrder = job.numOrder.toString()
      const clientName = job.client?.name.toLowerCase();
      const status = job.status.toLowerCase();
      const createdAt = moment(job.createdAt).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase();      
      const dueDate = moment(job.dueDate).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase(); 
      return (
        numOrder.includes(filter) ||
        clientName.includes(filter) ||
        status.includes(filter) ||
        createdAt?.includes(filter) ||
        dueDate?.includes(filter)
      );
    };
    // Apply the filter
    this.ordersDataSource.filter = filterValue;
    // Reset the paginator to the first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
    // Update the paginatedData with the filtered data
    const startIndex = this.paginator?.pageIndex * this.paginator?.pageSize || 0;
    const endIndex = startIndex + (this.paginator?.pageSize || 10);
    const paginatedData = this.ordersDataSource.filteredData.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Job>(paginatedData);
  }


  selectClient(client: Client) {
    this.router.navigate(['/clients/edit', client.id]);
  }

  getDueDateRate() {
    const count = this.ordersDataSource.data.filter((job) => job.doneAt? 
    moment(job.dueDate).isAfter(moment(job.doneAt)) : false
    ).length;
    this.dueDateRate = (count * 100) / this.ordersDataSource.data.length;
  }

  getDoneRate() {
    const count = this.ordersDataSource.data.filter((job) => job.status === 'DONE').length || 0;
    this.doneRate =  (count * 100) / this.ordersDataSource.data.length;
  }

  scrollLeft() {
    const container = this.elementRef.nativeElement.querySelector('.scroll-container');
    this.renderer.setProperty(container, 'scrollLeft', container.scrollLeft - 100);
  }

  scrollRight() {
    const container = this.elementRef.nativeElement.querySelector('.scroll-container');
    this.renderer.setProperty(container, 'scrollLeft', container.scrollLeft + 100);
  }

  generateLineChart(month: string, year: number) {
    const jobsPerDay = this.calculateJobsPerDay();
    const labels = Array.from({ length: 31 }, (_, index) => (index + 1).toString());
    const datasets = [];
  
    for (const jobType of Object.keys(jobsPerDay)) {
      const data = jobsPerDay[jobType][year][month] || Array.from({ length: 31 }, () => 0);
  
      datasets.push({
        label: jobType,
        data: data,
        fill: false,
        borderColor: this.getRandomColor(),
        tension: 0.4
      });
    }

    if (this.chart) {
      this.chart.destroy();
    }
  
    const chartCanvas = this.chartCanvas.nativeElement;
    const ctx = chartCanvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days of the Month'
            }
          },
          y: {
            beginAtZero: true,
            max: this.ordersDataSource.data.length,
            title: {
              display: true,
              text: 'Number of Jobs'
            },
            ticks: {
              stepSize: this.ordersDataSource.data.length /10
            }
          }
        }
      }
    });
    this.generating = false;
  }

  calculateJobsPerDay(): { [jobType: string]: { [year: number]: { [month: string]: number[] } } } {
    const jobsPerDay: { [jobType: string]: { [year: number]: { [month: string]: number[] } } } = {};
  
    for (const job of this.jobList) {
      const createdAt = moment(job.createdAt);
      const day = createdAt.date();
      const month = createdAt.format('MMM');
      const year = createdAt.year();
      const jobType = job.type;
  
      if (!jobsPerDay[jobType]) {
        jobsPerDay[jobType] = {};
      }
      if (!jobsPerDay[jobType][year]) {
        jobsPerDay[jobType][year] = {};
      }
      if (!jobsPerDay[jobType][year][month]) {
        jobsPerDay[jobType][year][month] = Array.from({ length: 31 }, () => 0);
      }
  
      jobsPerDay[jobType][year][month][day - 1]++;
    }
  
    return jobsPerDay;
  }

  getJobTypes() {
    const jobTypes: string[] = [];
    for (const job of this.ordersDataSource.data) {
      if (!jobTypes.includes(job.type)) {
        jobTypes.push(job.type);
      }
    }
    console.log("jobTypes :",jobTypes)
    return jobTypes;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  deleteOrder(job : Job){
    
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { title: "Delete Order ?", content: `Are you sure you want to delete this order ?` }
    });

    dialogRef.afterClosed().subscribe((result : string) => {

      if(result=="yes"){

        this.jobService.deleteJob(job.numOrder).subscribe({
          next : (response:any) => { 
            this.openSnackBar("Order Deleted.")
            this.ngAfterViewInit()
           },
          error : (error) => console.log("error during order deletion :",error),
          complete : () => { this.getDataSource()}

        })

      }})
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }
}
