import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/models/Client';
import { AuthService } from 'src/services/authService';
import { JobService } from 'src/services/jobService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

@Input() client ! :Client
clientForm !: FormGroup
isClientsPage : boolean = true

  constructor( private formBuilder : FormBuilder,
    private jobService : JobService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private dialog : MatDialog,
    private _snackBar: MatSnackBar,
    private authService : AuthService ) {

      this.isClientsPage = this.activatedRoute.snapshot.url.join("/").endsWith("clients")
     }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(){
   
    this.clientForm = this.formBuilder.group({
      name : new FormControl(this.client?.name || '', Validators.required),
      email : new FormControl(this.client?.email || ''),
      address : new FormControl(this.client?.address||'' ),
      tel : new FormControl(this.client?.tel|| '', Validators.maxLength(14)),
    })
  }

  saveClient() {

    if (this.clientForm.valid) {
     

      let data 
      if(this.client){
        data = { title: "Save Changes ?", content: `Are you sure you want to save those changes for this client ?` }
      }else{
        data = { title: "Save New Client?", content: `Do you want to Add this client ?` }
      }
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: data
      });
  
      dialogRef.afterClosed().subscribe((result : string) => {

        if(result=="yes"){
          if (this.client) {
            this.jobService.updateClient(this.client.id, this.clientForm.value).subscribe({
              next : (response : Client) => {
                this.client = response
                this.openSnackBar("Client Updated Successfully.")
                this.initializeForm()
                this.router.navigate(["/clients"])

              },
              error : (error) => { console.log("error updating client ",error)}
            })
          
        }else {
          this.jobService.createClient(this.clientForm.value).subscribe({
            next : (response: any) => {  
                    this.openSnackBar(" New Client Created successfully") 
                    this.router.navigate(["/clients"])
            },
            error : (error: any) => { console.error('Error creating user', error); } 
          })
        }
      }
    })
    }
  
  }

  deleteClient(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete Client ?", content : `Are you sure you want to delete  client ${this.client.name} ? This will delete all related orders of this clients.`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){

        this.jobService.deleteClient(this.client.id).subscribe({
          next : (response : any)  => {  
            this.openSnackBar(" Client Deleted.")
            this.router.navigate(["/clients"])
          },
          error : (error: any) => { console.error('Error deleting client', error); } 
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
