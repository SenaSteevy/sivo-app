import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Job } from 'src/models/Job';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/services/jobService';
import { Client } from 'src/models/Client';
import { Phase } from 'src/models/Phase';
import { Resource } from 'src/models/Resource';
import { Treatment } from 'src/models/Treatment';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

@Input('job') job ! : Job
isUpdate! : boolean
generalForm !: FormGroup
clientList : Client[] =[]
phaseList: Phase[]  =[]
treatmentList : Treatment[] =[]
resourceList : Resource[] =[]
detailsForm ! : FormGroup
phaseForm! : FormGroup
isOrdersPage : boolean = false;
loading : boolean = true;

nullTreatment : Treatment = {
  id: 0,
  description: '',
  phase: this.phaseList[0]
}
  constructor( private formBuilder : FormBuilder, 
    private jobService : JobService, 
    private router : Router, 
    private activatedRoute :ActivatedRoute,
    private _snackBar : MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef ,
    private dialog : MatDialog
    )  {

    this.phaseForm = this.formBuilder.group({
    })

    this.isOrdersPage = this.activatedRoute.snapshot.url.join("/").endsWith("orders");
    this.isUpdate = this.activatedRoute.snapshot.url.join("/").endsWith("edit")
   } 
  

    ngOnInit()  {
      
      this.jobService.updateJobService().finally( () => {
      this.phaseList = this.jobService.phaseList;
      this.clientList = this.jobService.clientlist;
      this.treatmentList = this.jobService.treatmentList;
      this.resourceList = this.jobService.resourceList;
      
      this.changeDetectorRef.detectChanges()
      
      this.initializeForm();

    });


    
  }
  
 
 

 
  initializeForm(){ 
    let control
    let initialValue
     this.phaseList.forEach((phase) => {
      initialValue = this.getTreatmentByPhase(phase).find( (treatment) => treatment.id == this.findJobPhaseTreatment(phase)?.id ) 
      control = new FormControl( initialValue || this.nullTreatment)
      this.phaseForm.addControl( phase.name, control)
     })
      
      this.generalForm = this.formBuilder.group({
        numOrder: [this.job?.numOrder || null, Validators.required],
        codeOrder: [this.job?.codeOrder || '', Validators.required],
        client: [ this.clientList.find((client) => client.id == this.job?.client.id) , Validators.required],
        resource: [this.resourceList.find((resource) => resource.id ==this.job?.resource.id), Validators.required],
        type: [this.job?.type , Validators.required]
      });
      this.generalForm.get('numOrder')?.disable();
      
      this.detailsForm = this.formBuilder.group({
        dueDate : [this.job?.dueDate || '',Validators.required],
        priority : [this.job?.priority.toString() || "1" , Validators.required]
      })

      if(this.isOrdersPage){
        this.phaseForm.disable()
      }

      this.loading = false;

    }

    findJobPhaseTreatment(phase: Phase) : Treatment | undefined{
      return this.job?.taskList.find((task) => task.treatment.phase.id ==phase.id )?.treatment 
    }

    getTreatmentByPhase(phase : Phase) : Treatment[]{
      return this.treatmentList.filter((treatment) => treatment.phase.id == phase.id  )
    }

    NewTreatment(phase: Phase) {
      this.router.navigate(['production-line/treatments/new'])
      
    }

    saveOrder(){

      if(this.generalForm.valid && this.detailsForm.valid && this.phaseForm.valid){
        
        let order : any = {
          numOrder: this.generalForm.get('numOrder')?.value,
          codeOrder: this.generalForm.get('codeOrder')?.value,
          client: this.generalForm.get('client')?.value,
          description: this.phaseForm.get('surfaçage')?.value.description,
          supplement : " new supplement ",
          type: this.generalForm.get('type')?.value,
          dueDate: moment(this.detailsForm.get('dueDate')?.value).format("YYYY-MM-DDTHH:mm:ss") ,
          taskList: this.createTaskList(),
          resource: this.generalForm.get('resource')?.value,
          startDateTime: null,
          leadTime: null,
          priority: this.detailsForm.get('priority')?.value,
          status: 'UNDONE',
          doneAt: null,
          createdAt:  moment().format("YYYY-MM-DDTHH:mm:ss")
        }

        console.log("dueDate", this.detailsForm.get('dueDate')?.value)

        if(!this.isUpdate){ 
          
          let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { title: "Save New Order ?", content: `Are you sure you want to save this order ?` }
          });
      
          dialogRef.afterClosed().subscribe((result : string) => {
            
            if(result=="yes"){
              this.jobService.newJob(order).subscribe({
                next : (response) => {
                  this.openSnackBar("New order saved.")
                  this.router.navigate(["orders"])
                },
                error : (error) => { console.log("error during save order : ", error)}
              })

            }
          })

          
          
        }else{
          
          this.jobService.updateJob(order.numOrder,order).subscribe({
            next : (response : any) => {
              this.openSnackBar(`Order N° ${response?.numOrder} updated.`)
              this.router.navigate(["orders"])
              console.log("Order updated successfully")
            },
            error : (error) => { console.log("error during update order : ", error)}
          })

        }

      }

    }


    createTaskList() : any{
      let taskList  = []
      for(let phase of this.phaseList){
        if(this.phaseForm.get(phase.name) && this.phaseForm.get(phase.name)?.value !== this.nullTreatment ){
          const task : any ={
            id : null,
            client: this.generalForm.get('client')?.value,
            treatment: this.phaseForm.get(phase.name)?.value,
            status: 'UNDONE',
            startTime: null,
            realStartTime: null
          }
          taskList.push(task)
        }
      }
      console.log("taskList :",taskList)
      return taskList

    }

    openSnackBar(message : string) {
      this._snackBar.open( message , '', {
        duration: 2000
      });
    }

    newResource(){
      this.router.navigateByUrl("resources/new")
    }

    newClient(){
      this.router.navigateByUrl("clients/new")
    }
}
