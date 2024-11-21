import { SelectionModel } from '@angular/cdk/collections';
import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { User } from 'src/models/User';
import { UserRequest } from 'src/models/UserRequest';
import { JobService } from 'src/services/jobService';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  displayedColumns: string[] = [ 'id','name','email','post', 'actions','select'];
  userRequestsDataSource: MatTableDataSource<UserRequest> = new MatTableDataSource<UserRequest>();
  paginatedData: MatTableDataSource<UserRequest> = new MatTableDataSource<UserRequest>();
  @ViewChild(MatPaginator) paginator: any;
  userRequestList: UserRequest[] = [];
  state : 'loading' | 'error' | 'ready' = 'loading';
  selection = new SelectionModel<UserRequest>(true, []);
  selectAllChecked = false;

  constructor(private jobService : JobService,
    private dialog : MatDialog,
    private _snackBar : MatSnackBar,
    private userService : UserService,
    private router : Router
    ) { }

  ngOnInit(): void {
    this.getDataSource()
  }

   getDataSource() {
    this.userRequestsDataSource = new MatTableDataSource<UserRequest>();
    this.paginatedData = new MatTableDataSource<UserRequest>();
    this.userService.getUserRequests().subscribe({
      next: (response: UserRequest[]) => {
        this.userRequestsDataSource.data.push(...response);
        this.paginatedData = new MatTableDataSource<UserRequest>( this.userRequestsDataSource.data.slice(0, 10))
        this.userRequestList = response
        this.state = 'ready'
      },
      error: (error: any) => {
        this.state = 'error'
        console.log('error during getAllUserRequests:', error)
      },
      complete :  () => {
        this.userRequestsDataSource.paginator = this.paginator; 
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const paginatedData = this.userRequestsDataSource.data.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<UserRequest>(paginatedData);
  }

  selectRow(checked: boolean, row: UserRequest): void {
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }
  applyAction(action: string): void {
    const selectedUserRequests = this.selection.selected;
    // Apply the action to selected tasks
    switch (action) {
      case 'Delete':
        this.deleteUserRequests(selectedUserRequests);
  
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

  deleteUserRequests(userRequest: UserRequest[]): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete register requests ?", content : `Are you sure you want to delete these register requests ?`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){
      let errors = 0;
      userRequest.forEach((userRequest) => {
        this.userService.deleteUserRequest(userRequest.id).subscribe({
          error : (error : any ) => {
            console.log("error during deleting userRequest :"+userRequest.firstName, error) 
            errors++}
        })    
      })
      if(errors == 0){ 
        setTimeout(()=>{
          this.getDataSource();
        this.openSnackBar("The register request list selected was deleted successfully.")
        }, 2000)
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Custom filtering function
    this.userRequestsDataSource.filterPredicate = (userRequest: UserRequest, filter: string) => {
      const id = userRequest.id.toString()
      const firstName = userRequest.firstName.toLowerCase();
      const lastName = userRequest.lastName.toLowerCase();
      const email = userRequest.email.toLowerCase();      
      const gender = userRequest.gender.toLowerCase(); 
      const post = userRequest.post.toLowerCase(); 
      const status = userRequest.status.toLowerCase(); 
      return (
        id.includes(filter) ||
        firstName.includes(filter) ||
        lastName.includes(filter) ||
        email.includes(filter) ||
        gender.includes(filter) ||
        post.includes(filter) ||
        status.includes(filter)
      );
    };
    // Apply the filter
    this.userRequestsDataSource.filter = filterValue;
    // Reset the paginator to the first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
    // Update the paginatedData with the filtered data
    const startIndex = this.paginator?.pageIndex * this.paginator?.pageSize || 0;
    const endIndex = startIndex + (this.paginator?.pageSize || 10);
    const paginatedData = this.userRequestsDataSource.filteredData.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<UserRequest>(paginatedData);
  }

  deleteUserRequest(userRequest : UserRequest){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete register request ?", content : `Are you sure you want to delete this register request ?`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){

        this.userService.deleteUserRequest(userRequest.id).subscribe({
          next : (response : any)  => {  
            this.openSnackBar("Request Deleted.")
            this.getDataSource()
          },
          error : (error: any) => { console.error('Error deleting userRequest', error); },
          complete : () => { this.getDataSource()}
 
        })
      }
    })
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }

  acceptUser(userRequest : UserRequest){

    this.userService.getRoleByName("User").subscribe({
      next : (response : any) => {

        const user : User = {
          id: "",
          email: userRequest.email,
          gender: userRequest.gender,
          firstName: userRequest.firstName,
          lastName: userRequest.lastName,
          post: userRequest.post,
          role: response,
          profile: null,
          password: ''
        }
   
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
   
         width: '400px',
         data : { title : "Accept UserRequest ?", content : `Are you sure you want to add this person as a new user of the app ?`}
       })
   
       dialogRef.afterClosed().subscribe((result : string) =>{
         if(result=="yes"){
           this.userService.createUser(user).subscribe({
             next : (response : any) => {
               if(response.id==0){
                this.dialog.open(DialogComponent, {
                  width: '400px',
                  data : { title : "User already exist", message : `The person is already a user. We will remove this request then.`}
                })}

               this.userService.deleteUserRequest(userRequest.id).subscribe({
                next : (response : any)  => {  
                  this.openSnackBar("Request Deleted.")
                },
                error : (error: any) => { console.error('Error deleting userRequest', error); } 
              })
              this.router.navigate([`users/${response.id}/edit`])
            },
            error : (error : any) => {
              console.log("error when creating new user :", error)
            }
          })
         }
       })
      },
      error : (error : any) => {
        console.log("error when creating new user :", error)
      }
    })

     
  }


}
