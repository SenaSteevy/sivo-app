import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Phase, Timeslot } from 'src/models/Phase';
import { JobService } from 'src/services/jobService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-phase-form',
  templateUrl: './phase-form.component.html',
  styleUrls: ['./phase-form.component.css']
})
export class PhaseFormComponent implements OnInit , AfterViewInit{


  @Input() phase ! :Phase
  phaseForm !: FormGroup
  isPhasesPage : boolean = true
  timeslotList: Timeslot[] = [];
  screenSize : any

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
  ]
    constructor( private formBuilder : FormBuilder,
      private jobService : JobService,
      private router : Router,
      private activatedRoute : ActivatedRoute,
      private dialog : MatDialog,
      private _snackBar: MatSnackBar,
       ) {
        this.isPhasesPage = this.activatedRoute.snapshot.url.join("/").endsWith("production-line")
       }
  
  ngAfterViewInit(): void {
  }
  
       ngOnInit(): void {
        this.initializeForm()

        window.addEventListener('resize', () => {
           this.screenSize = window.innerWidth;
         
        });
      
      }
    
      initializeForm() {
        this.phaseForm = this.formBuilder.group({
          id : new FormControl(this.phase?.id),
          name: new FormControl(this.phase?.name || '', Validators.required),
          capacity: new FormControl(this.phase?.capacity || '', Validators.required),
          duration: new FormControl(this.phase ? this.convertDurationToTime(this.phase.duration) : ''),
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
        // Add form controls to phaseForm
        this.timeslots.forEach((slot) => {
          this.phaseForm.addControl('enabled_' + slot.dayOfWeek, new FormControl(slot.enabled));
          this.phaseForm.addControl('startTime_' + slot.dayOfWeek, new FormControl(slot.startTime));
          this.phaseForm.addControl('endTime_' + slot.dayOfWeek, new FormControl(slot.endTime));
        });
      }
    
    savePhase() {
  
      if (this.phaseForm.valid) {
       
  
        let data 
        if(this.phase){
          data = { title: "Save Changes ?", content: `Are you sure you want to save those changes for this phase ?` }
        }else{
          data = { title: "Save New Phase?", content: `Do you want to Add this phase ?` }
        }
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: data
        });
    
        dialogRef.afterClosed().subscribe((result : string) => {
  
          if(result=="yes"){
            this.createTimeslotList();
            const newPhase  = {
              id :  0,
              name : this.phaseForm.get('name')?.value,
              capacity : parseInt(this.phaseForm.get('capacity')?.value),
              duration : this.convertTimeToDuration(this.phaseForm.get('duration')?.value),
              timeslotList : this.timeslotList
            }
                
            if (this.phase) {
              this.jobService.updatePhase(this.phase.id, newPhase).subscribe({
                next : (response : Phase) => {
                  this.phase = response
                  this.openSnackBar("Phase Updated Successfully.")
                  this.initializeForm()
                  this.router.navigate(["/production-line"])

                },
                error : (error) => { console.log("error updating phase ",error)}
              })
            
          }else {
            this.jobService.createPhase(newPhase).subscribe({
              next : (response: any) => {  
                      this.openSnackBar(" New Phase Created successfully") 
                      this.router.navigate(["/production-line"])
              },
              error : (error: any) => { console.error('Error creating user', error); } 
            })
          }
        }
      })
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
              this.router.navigate(["/phases"])
            },
            error : (error: any) => { console.error('Error deleting phase', error); } 
          })
        }
      })
    }

    createTimeslotList(): void {
      let newTimeslot : Timeslot
      this.timeslots.forEach((slot) => {
        slot.id = this.phase?.timeslotList?.find((timeslot) => timeslot.dayOfWeek == slot.dayOfWeek)?.id || 0
        slot.startTime = this.phaseForm.get('startTime_'+slot.dayOfWeek)?.value
        slot.endTime = this.phaseForm.get('endTime_'+slot.dayOfWeek)?.value 
        slot.enabled = this.phaseForm.get('enabled_'+slot.dayOfWeek)?.value 

        if(slot.enabled){
          newTimeslot = {
            id : slot.id,
            dayOfWeek : slot.dayOfWeek,
            startTime : slot.startTime,
            endTime : slot.endTime
          }
          this.timeslotList.push(newTimeslot)
        }
      })


    }
  
    openSnackBar(message : string) {
      this._snackBar.open( message , '', {
        duration: 2000
      });
    }

    convertDurationToTime(durationString: string): string {
      // Example: durationString = "PT2M" (2 minutes)
  
      const duration = moment.duration(durationString);
      const hours = duration.hours();
      const minutes = duration.minutes();
  
      // Convert to "HH:mm" format
      const hoursString = hours < 10 ? '0' + hours : String(hours);
      const minutesString = minutes < 10 ? '0' + minutes : String(minutes);
  
      return hoursString + ':' + minutesString;
    }

    convertTimeToDuration(timeString: string): string {
      // Example: timeString = "02:30" (2 hours and 30 minutes)
      const [hours, minutes] = timeString.split(':');
  
      // Calculate the total duration in minutes
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  
      // Create the Java Duration string format (e.g., "PT2M" for 2 minutes)
      return `PT${totalMinutes}M`;
    }
  
    onCheckboxChange(event : any , dayOfWeek : string) {
      if(event){
        this.phaseForm.get('startTime_'+dayOfWeek)?.enable
        this.phaseForm.get('endTime_'+dayOfWeek)?.enable
      }else{
        this.phaseForm.get('startTime_'+dayOfWeek)?.disable
        this.phaseForm.get('endTime_'+dayOfWeek)?.disable

      }
    }
  
  }
  