  import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit, ViewChild } from '@angular/core';
  import { Chart, registerables } from 'chart.js';
  import { Planning } from 'src/models/Planning';
  import { JobService } from 'src/services/jobService';
  import * as moment from 'moment';
  import { trigger, state, style, animate, transition } from '@angular/animations';
  import { Phase } from 'src/models/Phase';
  import { Job } from 'src/models/Job';
  import { Task } from 'src/models/Task';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
  

  @Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css'],
    animations: [
      trigger('expandCollapse', [
        state(
          'collapsed',
          style({ height: '0px', opacity: 0, overflow: 'hidden' })
        ),
        state('expanded', style({ height: '*', opacity: 1 })),
        transition('collapsed <=> expanded', animate('250ms ease-in-out'))
      ])
    ]
  })
  export class ScheduleComponent implements OnInit, AfterViewInit {


    @ViewChild('lottieAnimation') lottieAnimation!: ElementRef;
    @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef>;
    expandedIndex: number = -1;
    plannings: Planning[] = [];
    filteredPlannings: Planning[] = [];

    private charts: Chart[] = [];
    lottieAnimations: boolean[] = [];
    phases: Phase[] = [];
    
    selectedDate!: Date ;
    loading = true;
    error = false;
    generating = false;
    constructor(
      private jobService: JobService, 
      private activatedRoute : ActivatedRoute,
      private _snackBar: MatSnackBar,
      private dialog : MatDialog
      ) { 

      if(this.activatedRoute.snapshot.url.join("/").endsWith("new")){
        this.generateNewPlanning()
      }
      
    }

      ngOnInit() {
      this.loading = true
      Chart.register(...registerables);
      this.getAllphases(); 
      this.loadPlannings();
      
    }

    startLottieAnimation(index: number) {
      this.lottieAnimations[index] = true;
    }

    stopLottieAnimation(index: number) {
      this.lottieAnimations[index] = false;
    }

    ngAfterViewInit() {
      setTimeout(() => {

      this.initializeCharts();
    }, 300);  
    }


    loadPlannings() {
      this.loading = true
      this.filteredPlannings = [];
      this.jobService.getAllPlannings().subscribe({
        next : (plannings: Planning[]) => {
          this.plannings = plannings.sort( (a, b) => moment(b.createdAt).diff(moment(a.createdAt)) )
          
          
    },
    error : (error :any ) => { 
      this.error = true
      console.log("error loading plannings : ",error)},
    
    complete : () => {
         this.filterPlannings()
         this.generating = false;
        } 
  });
}

  

  
  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }
   filterPlannings() {   
    this.loading = true

    this.filteredPlannings = this.plannings.filter(planning =>
      moment(planning.createdAt).isSame(this.selectedDate,'day')
    );
    console.log(this.filteredPlannings.length)
   
    if(this.filteredPlannings.length > 0){
      setTimeout(() => {
        this.initializeCharts();
      }, 100);  
    }
    this.loading = false  
  }

    

    async initializeCharts() {
     this.chartCanvases.forEach((canvas, index) => {
        const ctx = canvas.nativeElement.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: []
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                ticks: {
                  callback: (value) => {
                    const date = new Date(value);
                    return moment(date, 'MMM D, YYYY HH:mm').format('MMM D, YYYY HH:mm');
                  }
                },
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Num Order'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataPoint = context.parsed.x;
                    return moment(dataPoint).format('MMM D, YYYY HH:mm');
                  }
                }
              }
            }
          }
        });

        this.charts.push(chart);

        const planning = this.plannings[index];
        const data = planning.jobList.map(job => ({
          x: job.startDateTime? new Date(job.startDateTime).getTime() :  new Date().getTime(),
          y: job.numOrder,
          r: 2,
          backgroundColor: this.getRandomColor() // Assign random color to each data point
        }));

        chart.data.datasets.push({
          label: 'Orders',
          data: data,
        });

        chart.update();
      });

    }

    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    getIconName(rate: number): string {
      if (rate > 90) {
        return 'good-rate.json';
      } else if (rate > 70) {
        return 'average-rate.json';
      } else {
        return 'bad-rate.json';
      }
    }

    getRateText(rate: number): string {
      if (rate > 95) {
        return 'very-good';
      } else if (rate > 75) {
        return 'pretty-good';
      } else if( rate > 50 ) {
        return 'average';
      }else{
        return 'bad';
      }
    }


    getAllphases(): void {
      this.jobService.getAllPhases().subscribe({
        next: (response) => {
          this.phases = response
          }
      })
      
    }

    getTaskList(jobList : Job[]): Task[]{
      let tasks : Task[] = []
      jobList.forEach((job) => job.taskList.forEach((task) => tasks.push(task)))
      return tasks
      }

    async generateNewPlanning(){
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {

        width: '400px',
        data : { title : "Generate new planning ?", content : `Are you sure you want to generate a new planning ? This could take some times according to the numbers of undone orders that need to be scheduled. `}
      });
  
      dialogRef.afterClosed().subscribe((result : string) =>{
        if(result=="yes"){  
          this.generating = true;
        this.jobService.makeNewPlanning().subscribe({
          next : (response : any) => {
            this.plannings.push(response)
            },
          error : (error: any) => { 
            console.log(error)
            this.dialog.open(DialogComponent, {

              width: '400px',
              data : { title : "Oups!", message : `An error occured during generating a new orders planning. If the problem persist please contact an administrator.`}
            });
          },
          complete : () => { this.loadPlannings()}
            })
          }
      })
    }

    deletePlanning(planning: Planning) {

      let dialogRef = this.dialog.open(ConfirmDialogComponent, {

        width: '400px',
        data : { title : "Delete a planning ?", content : `Are you sure you want to delete this planning ?`}
      });
  
      dialogRef.afterClosed().subscribe((result : string) =>{
        if(result=="yes"){  
          this.generating = true;
        this.jobService.deletePlanning(planning.id).subscribe({
          next : (response:any) => {
            this.plannings.push(response)
            },
          error : (error:any) => { console.log(error)},
          complete : () => { this.loadPlannings()}
            })
          }
      })
    }
  }


