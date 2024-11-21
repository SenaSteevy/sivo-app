import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { range } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AutoPlanning } from 'src/models/AutoPlanning';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {

  daysOfWeek = ["monday", "tuesday","wednesday","thursday","friday","saturday","sunday"]
  planningForm !: FormGroup;
  autoPlanning : AutoPlanning = { id : 0, value : "OFF", monday : [], tuesday : [], wednesday : [], thursday : [], friday : [], saturday : [], sunday : []}
  isToggleOn : boolean = false

  displayTimers : boolean = true
  emptyFormArray !: FormArray ;

  constructor(private _formBuilder: FormBuilder,
    private jobService : JobService,
    private _snackBar : MatSnackBar,
    private matDialog : MatDialog,
    private changeDetectorRef: ChangeDetectorRef) {

      this.initializePlanningForm()
      

   }
   
   ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.getAutoPlanning()
  }

  
  getAutoPlanning(){
    this.jobService.getAutoPlanning().subscribe({
      next : (response : AutoPlanning) => { 
        this.autoPlanning = response
        this.isToggleOn = response.value =='ON'
        this.updatePlanningForm()
      },
      error : (error : any) => { console.log("error getting autoPlanning Data :",error)}
    })
  }
  

  
  initializePlanningForm(){

    this.planningForm = this._formBuilder.group({
      value  : new FormControl(this.autoPlanning.value),
      monday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([])}),
      tuesday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([]) }),
      wednesday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([]) }),
      thursday :new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([]) }),
      friday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([])}),
      saturday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([])}),
      sunday : new FormGroup({ times : new FormControl(null), array : this._formBuilder.array([])})
    })

    
  }
  
  updatePlanningForm(){
    if(this.autoPlanning.monday?.length > 0 ){
      this.planningForm.get("monday")?.get("times")?.setValue(this.autoPlanning.monday.length)
      this.handleChanges("monday", this.autoPlanning.monday)
    }
    
    if(this.autoPlanning.tuesday?.length > 0 ){
      this.planningForm.get("tuesday")?.get("times")?.setValue(this.autoPlanning.tuesday.length)
      this.handleChanges("tuesday", this.autoPlanning.tuesday)
    }
    if(this.autoPlanning.wednesday?.length > 0 ){
      this.planningForm.get("wednesday")?.get("times")?.setValue(this.autoPlanning.wednesday.length)
      this.handleChanges("wednesday", this.autoPlanning.wednesday)
    }
    if(this.autoPlanning.thursday?.length > 0 ){
      this.planningForm.get("thursday")?.get("times")?.setValue(this.autoPlanning.thursday.length)
      this.handleChanges("thursday", this.autoPlanning.thursday)
    }
    if(this.autoPlanning.friday?.length > 0 ){
      this.planningForm.get("friday")?.get("times")?.setValue(this.autoPlanning.friday.length)
      this.handleChanges("friday", this.autoPlanning.friday)
    }
    if(this.autoPlanning.saturday?.length > 0 ){
      this.planningForm.get("saturday")?.get("times")?.setValue(this.autoPlanning.saturday.length)
      this.handleChanges("saturday", this.autoPlanning.saturday)
    }
    if(this.autoPlanning.sunday?.length > 0 ){
      this.planningForm.get("sunday")?.get("times")?.setValue(this.autoPlanning.sunday.length)
      this.handleChanges("sunday", this.autoPlanning.sunday)
    }

  }
  

  
  handleChanges(day: string, array : string[]): void {
    this.displayTimers = false
    const numberOfTimes = this.planningForm.get(day)?.get('times')?.value;
    
    if( numberOfTimes != this.planningForm.get(day)?.get('array')?.value.length){
      
      this.planningForm.get(day)?.get('array')?.setValue([])
      
      if(array?.length > 0 ){
        array.forEach((time) => this.planningForm.get(day)?.get('array')?.value.push(new FormControl(time.split(":")[0]+":"+time.split(":")[1])))
      }
      else {   
        for (let i = 0; i < numberOfTimes; i++) {
          this.planningForm.get(day)?.get('array')?.value.push( new FormControl(null))
        }  
      }
    
      setTimeout(() =>{
        this.displayTimers = true
        this.changeDetectorRef.detectChanges(); // Force change detection
      },500)
    }
  }
  
  HandleToggleChange(event : any){
    const toggleEvent = event as unknown as MatSlideToggleChange;
    this.isToggleOn = toggleEvent.checked;
  
    this.jobService.setAutoPlanning(this.isToggleOn? "ON":"OFF").subscribe({
      next : (response : any)  => { 
        this.planningForm.get('value')?.setValue(this.isToggleOn? "ON":"OFF")
        this._snackBar.open(`Auto Planification is now ${this.isToggleOn?"ON.":"OFF."}`,'X',{ duration : 3000})
      },
      error : (error)  => { 
        console.log("error setting AutoPlanningValue : ",error)}
    })
  }

  getTimesArray(times: number): number[] {
    return Array.from({ length: times }, (_, i) => i); // Use Array.from and loop index
  }
  submitForm(){
    if(this.planningForm.valid){
      
      this.autoPlanning.id = 1
      this.autoPlanning.value = this.isToggleOn? "ON":"OFF"
      this.autoPlanning.monday = this.getControlsValue(this.planningForm.get('monday')?.get('array')?.value)
      this.autoPlanning.tuesday = this.getControlsValue(this.planningForm.get('tuesday')?.get('array')?.value)
      this.autoPlanning.wednesday = this.getControlsValue(this.planningForm.get('wednesday')?.get('array')?.value)
      this.autoPlanning.thursday = this.getControlsValue(this.planningForm.get('thursday')?.get('array')?.value)
      this.autoPlanning.friday = this.getControlsValue(this.planningForm.get('friday')?.get('array')?.value)
      this.autoPlanning.saturday = this.getControlsValue(this.planningForm.get('saturday')?.get('array')?.value)
      this.autoPlanning.sunday = this.getControlsValue(this.planningForm.get('sunday')?.get('array')?.value)


      console.log("autoPlanning sended :",this.autoPlanning)
      this.jobService.updateAutoPlanning(this.autoPlanning).subscribe({
        next : (response : any) => {
          this._snackBar.open("AutoPlanning Settings saved", "X",{duration: 3000})
        },
        error : (error:any) => {
          this.matDialog.open(DialogComponent, {
            width: '300px',
            data: { title: "OUPS !", message: "An error occured during saving Settings. Please Try Again or conact an administrator." }
          })
          console.log("error during saving AutoPlanning", error)}
      })

    }

  }

 
  getControlsValue(value: any[]): string[] {
    if (value) {
      return value.map((formControl) => formControl.value);
    }
    return [];
  }
  
}
