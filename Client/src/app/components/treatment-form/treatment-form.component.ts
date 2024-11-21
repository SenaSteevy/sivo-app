import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Treatment } from 'src/models/Treatment';
import { AuthService } from 'src/services/authService';
import { JobService } from 'src/services/jobService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Phase } from 'src/models/Phase';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-treatment-form',
  templateUrl: './treatment-form.component.html',
  styleUrls: ['./treatment-form.component.css']
})
export class TreatmentFormComponent implements OnInit {

  @Input() treatment ! :Treatment
  treatmentForm !: FormGroup
  isTreatmentsPage : boolean = true
  phaseList : Phase[] = []
  
    constructor( private formBuilder : FormBuilder,
      private jobService : JobService,
      private router : Router,
      private activatedRoute : ActivatedRoute,
      private dialog : MatDialog,
      private _snackBar: MatSnackBar,
      private authService : AuthService ) {
        this.isTreatmentsPage = this.activatedRoute.snapshot.url.join("/").endsWith("treatments")
       }
  
    ngOnInit(): void {
      this.phaseList = this.jobService.phaseList;
      this.initializeForm()

    }
  
    initializeForm(){
     
      this.treatmentForm = this.formBuilder.group({
        description : new FormControl(this.treatment?.description || '', Validators.required),
        phase : new FormControl(this.phaseList[this.phaseList.findIndex((item) => item.id == this.treatment?.phase.id )] || '', Validators.required),
      })
    }
  
    saveTreatment() {
  
      if (this.treatmentForm.valid) {
       
  
        let data 
        if(this.treatment){
          data = { title: "Save Changes ?", content: `Are you sure you want to save those changes for this treatment ?` }
        }else{
          data = { title: "Save New Treatment?", content: `Do you want to Add this treatment ?` }
        }
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: data
        });
    
        dialogRef.afterClosed().subscribe((result : string) => {
  
          if(result=="yes"){
            if (this.treatment) {
              this.jobService.updateTreatment(this.treatment.id, this.treatmentForm.value).subscribe({
                next : (response : Treatment) => {
                  
                    this.openSnackBar("Treatment Updated Successfully.")
                    this.initializeForm()
                    this.router.navigate(["/production-line/treatments"])
                },
                error : (error) => { console.log("error updating treatment ",error)}
              })
            
          }else {
            this.jobService.createTreatment(this.treatmentForm.value).subscribe({
              next : (response: any) => {  
                  this.treatment = response
                  if(!this.treatment ){
                    this.dialog.open(DialogComponent,{
                      width : '500px',
                      data : { title:'Already Exist!', message:'This treatment already exist. please change the description treatment'}
                    })
                  }else{
                      this.openSnackBar(" New Treatment Created successfully") 
                      this.router.navigate(["/production-line/treatments"])
                  }
                    },
              error : (error: any) => { console.error('Error creating user', error); } 
            })
          }
        }
      })
      }
    
    }
  
    deleteTreatment(){
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
  
        width: '400px',
        data : { title : "Delete Treatment ?", content : `Are you sure you want to delete  treatment ${this.treatment.description} ? This will delete all related orders of this treatments.`}
      })
  
      dialogRef.afterClosed().subscribe((result : string) =>{
        if(result=="yes"){
  
          this.jobService.deleteTreatment(this.treatment.id).subscribe({
            next : (response : any)  => {  
              this.openSnackBar(" Treatment Deleted.")
              this.router.navigate(["/treatments"])
            },
            error : (error: any) => { console.error('Error deleting treatment', error); } 
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
  