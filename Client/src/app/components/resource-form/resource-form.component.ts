import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from 'src/models/Resource';
import { AuthService } from 'src/services/authService';
import { JobService } from 'src/services/jobService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent implements OnInit {


 @Input()resource ! :Resource
  resourceForm !: FormGroup
  isResourcesPage : boolean = true
  
    constructor( private formBuilder : FormBuilder,
      private jobService : JobService,
      private router : Router,
      private activatedRoute : ActivatedRoute,
      private dialog : MatDialog,
      private _snackBar: MatSnackBar,
      private authService : AuthService ) {
  
        this.isResourcesPage = this.activatedRoute.snapshot.url.join("/").endsWith("resources")
       }
  
    ngOnInit(): void {
      this.initializeForm()
    }
  
    initializeForm(){
     
      this.resourceForm = this.formBuilder.group({
        name : new FormControl(this.resource?.name || '', Validators.required),
        type : new FormControl(this.resource?.type || '', Validators.required),
        quantity : new FormControl(this.resource?.quantity||'', Validators.required ),
        createdAt : new FormControl(this.resource?.createdAt||''),
      })
    }
  
    saveResource() {
  
      if (this.resourceForm.valid) {
       
        this.resourceForm.get('createdAt')?.setValue(moment().format("YYYY-MM-DDTHH:mm:ss"))
  
        let data 
        if(this.resource){
          data = { title: "Save Changes ?", content: `Are you sure you want to save those changes for this resource ?` }
        }else{
          data = { title: "Save New Resource?", content: `Do you want to Add this resource ?` }
        }
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: data
        });
    
        dialogRef.afterClosed().subscribe((result : string) => {
  
          if(result=="yes"){
            if (this.resource) {
              this.jobService.updateResource(this.resource.id, this.resourceForm.value).subscribe({
                next : (response : Resource) => {
                  this.resource = response
                  this.openSnackBar("Resource Updated Successfully.")
                  this.initializeForm()
                  this.router.navigate(["/resources"])
                },
                error : (error) => { console.log("error updating resource ",error)}
              })
            
          }else {
            this.jobService.createResource(this.resourceForm.value).subscribe({
              next : (response: any) => {  
                      this.openSnackBar(" New Resource Created.") 
                      this.router.navigate(["/resources"])
              },
              error : (error: any) => { console.error('Error creating user', error); } 
            })
          }
        }
      })
      }
    
    }
  
    deleteResource(){
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
  
        width: '400px',
        data : { title : "Delete Resource ?", content : `Are you sure you want to delete  resource ${this.resource.name} ? This will delete all related orders of this resources.`}
      })
  
      dialogRef.afterClosed().subscribe((result : string) =>{
        if(result=="yes"){
  
          this.jobService.deleteResource(this.resource.id).subscribe({
            next : (response : any)  => {  
              this.openSnackBar(" Resource Deleted.")
              this.router.navigate(["/resources"])
            },
            error : (error: any) => { console.error('Error deleting resource', error); } 
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
  