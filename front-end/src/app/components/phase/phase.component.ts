import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Phase, Timeslot } from 'src/models/Phase';
import { JobService } from 'src/services/jobService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';



@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class PhaseComponent implements OnInit {
  
  @Input() phase !: Phase;
timeslots = [
  {
    id : 0,
    dayOfWeek : "MONDAY",
    startTime :"",
    endTime : "",
    enabled : false
  },
  {
    id : 0,
    dayOfWeek : "TUESDAY",
    startTime :"",
    endTime : "" ,
    enabled : false
  },
  {
    id : 0,
    dayOfWeek : "WEDNESDAY",
    startTime :"",
    endTime : "",
    enabled : false 
  },
  {
    id : 0,
    dayOfWeek : "THURSDAY",
    startTime :"",
    endTime : "" ,
    enabled : false
  },
  {
    id : 0,
    dayOfWeek : "FRIDAY",
    startTime :"",
    endTime : "",
    enabled : false 
  },
  {
    id : 0,
    dayOfWeek : "SATURDAY",
    startTime :"",
    endTime : "" ,
    enabled : false
  },
  {
    id : 0,
    dayOfWeek : "SUNDAY",
    startTime :"",
    endTime : "" ,
    enabled : false
  }
];
stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  constructor(private jobService : JobService,
    private router : Router,
    private dialog : MatDialog,
    private _snackBar: MatSnackBar,
    private breakpointObserver : BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 1015px)']).subscribe((state: BreakpointState) => {
      this.stepperOrientation = state.matches ? 'vertical' : 'horizontal';
    });
    if (this.phase && this.phase.timeslotList) {
      this.timeslots.forEach((slot) => {
        const foundSlot = this.phase.timeslotList.find(
          (timeslot) => timeslot.dayOfWeek === slot.dayOfWeek
        );
        if (foundSlot) {
          slot.enabled = true;
          slot.startTime = foundSlot.startTime;
          slot.endTime = foundSlot.endTime;
        } else {
          slot.enabled = false;
          slot.startTime = '';
          slot.endTime = '';
        }
      });
    }
  }
  
  deletePhase(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete Phase ?", content : `Are you sure you want to delete  phase ${this.phase.name} ? This action will delete this phase from all orders and delete all related Treatments also.Please,Be careful.`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){

        this.jobService.deletePhase(this.phase.id).subscribe({
          next : (response : any)  => {  
            this.openSnackBar(" Phase Deleted.")
            this.router.navigate(["/production-line"])
          },
          error : (error: any) => { console.error('Error deleting phase', error); } 
        })
      }
    })
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }

 

}
