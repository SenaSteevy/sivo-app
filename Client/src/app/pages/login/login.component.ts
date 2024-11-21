import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileHandle } from 'src/models/FileHandle';
import { AuthService } from 'src/services/authService';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : any
  registerForm : any
  isRegistered : any = localStorage.getItem('isRegistered')
  error : any;

  constructor(private authService : AuthService, 
    private userService : UserService, 
    private router : Router, 
    public dialog: MatDialog,
    private _snackBar : MatSnackBar,
    private sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    if(!!this.userService.connectedUser){
      this.router.navigate(['/home']);
    }
    this.loginForm =  new FormGroup({
      username : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required])  
    }) 

    this.registerForm = new FormGroup({
      gender : new FormControl( '',[Validators.required]),
      firstName : new FormControl('',[Validators.required]),
      lastName : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.required, Validators.email]),
      post : new FormControl('',[Validators.required])

    })

    if(this.authService.sessionExpired){
      this.openSnackBar("Session expired. Please reconnect...")
    }
    
  }

  login(){
    
        this.userService.login(this.loginForm.value).subscribe({
        next : (response : any)  => { 
               
              this.userService.connectedUser = response.user
              this.authService.setUser(response.user)
              this.authService.setRoles(response.user.role)
              this.authService.setToken(response.jwtToken)
              
              this.router.navigate(['/home'])     
              },
        error : (error) =>{ console.log(error.message)
              this.error = error.message}
        })
      
  }

  register(){
    if(localStorage.getItem("isRegistered") ==="yes"){ 
      this.openDialog("Already submited !", "You already submited for a registration.")
    }
    else{
      this.userService.newRegisterRequest(this.registerForm.value).subscribe({
        next : (response : any) =>{
          let title = "Registration submited"
          let message = response.firstName +" "+response.lastName+", you have succesfully submited your registration. A Manager will allow your access very soon." 
          this.openDialog( title, message)
          },

        error : (error: any ) =>{
          console.log(error.message)
          this.openDialog("Oups !", "An error occured : "+error.message)
        }
                        
        })
    }
  }

  openDialog( title :string, message:string): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.setItem("isRegistered", "yes")
    });
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }
  
}
