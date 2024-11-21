  import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
  import { UserService } from 'src/services/userService';
  import { User } from 'src/models/User';
  import { Role } from 'src/models/Role';
  import { ActivatedRoute, Router } from '@angular/router';
  import { MatDialog } from '@angular/material/dialog';
  import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
  import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/models/FileHandle';
import { AuthService } from 'src/services/authService';
import { Observable, Subject } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';

  @Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.css']
  })
  export class UserFormComponent implements OnInit {
    @Input() user!: User;
    @Input('isProfile') isProfile ! : boolean;

    @Output() userDeleted: EventEmitter<void> = new EventEmitter<void>();
    @ViewChild('fileInput') fileInput ! : HTMLInputElement

    userForm ! : FormGroup
    profileImage: File | null = null;
    roleList: Role[] = [];
    isProfileImageChanged: boolean = false;
    selectedProfileImage : any
    isUsersPage = false;
    loading = true;
    uploadProgress$: Observable<number>;
    private uploadProgressSubject: Subject<number>;

    constructor( private userService: UserService, 
      private formBuilder: FormBuilder, 
      activatedRoute : ActivatedRoute,
      private dialog : MatDialog,
      private router : Router,
      private _snackBar: MatSnackBar,
      private sanitizer : DomSanitizer,
      private authService : AuthService ){ 

      this.isUsersPage = activatedRoute.snapshot.url.join('/').endsWith("users")
      this.uploadProgressSubject = new Subject<number>();
      this.uploadProgress$ = this.uploadProgressSubject.asObservable();
    }
  

    ngOnInit(): void {
      this.getAllRoles();
      this.initializeForm();   
    }
  
      getAllRoles() {
        this.userService.getAllRoles().subscribe(
          (response: any) => {
            this.roleList = response;
          },
          (error: any) => {
            console.log("error loading roles: ", error);
          }
        );
      }

    initializeForm() {
      

      this.userForm = this.formBuilder.group({
        gender: new FormControl(this.user?.gender, Validators.required),
        firstName: new FormControl( this.user?.firstName, Validators.required),
        lastName: new FormControl(this.user?.lastName, Validators.required),
        email: new FormControl( this.user?.email, [Validators.required, Validators.email]),
        password : new FormControl(this.user?.password, [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl(this.user?.password, Validators.required),
        post: new FormControl( this.user?.post, Validators.required),
        role: new FormControl(this.user?.role),
        profile : new FormControl(this.user?.profile)
      });

      if(this.isUsersPage){
        this.userForm.get('gender')?.disable()
        this.userForm.get('role')?.disable()
      }
      this.userForm.get('confirmPassword')?.setValidators([Validators.required, this.matchPassword.bind(this)]);
      
    }

    matchPassword(): ValidationErrors | null {
      const password = this.userForm.get('password')?.value || '';
      const confirmPassword = this.userForm.get('confirmPassword')?.value || '' ;
    
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
    
      return null;
    }

    compareRoles(role1: Role, role2: Role): boolean {
      return role1.roleName === role2.roleName;
    }
    
    
    onFileSelected(event: any) {
      const file = event.target.files[0];
    
      if (file ) {

        const fileHandle : FileHandle = {
          file : file,
          url : this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
        }
        this.profileImage = file;
        this.isProfileImageChanged = true;

        // Read the selected image and convert it to data URL
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedProfileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    
    
 

    saveUser() {

      if (this.userForm.valid) {
        const formData = new FormData();
        formData.append('gender', this.userForm.get('gender')?.value);
        formData.append('firstName', this.userForm.get('firstName')?.value);
        formData.append('lastName', this.userForm.get('lastName')?.value);
        formData.append('email', this.userForm.get('email')?.value);
        formData.append('password', this.userForm.get('password')?.value);
        formData.append('post', this.userForm.get('post')?.value);
        formData.append('roles', JSON.stringify(this.userForm.get('roles')?.value))

        let data 
        if(this.user){
          data = { title: "Save Changes ?", content: `Are you sure you want to save those changes for this user ?` }
        }else{
          data = { title: "Save New User?", content: `Do you want to Add this user ?` }
        }
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: data
        });
    
        dialogRef.afterClosed().subscribe((result : string) => {

          if(result=="yes"){
            if (this.user) {
              // Update existing user
              if (this.isProfileImageChanged && this.profileImage) {
                
                this.userService.updateUser(this.user.id, this.userForm ).subscribe(
                  
                  (response: any) => {

                     //if image size > 3 MB
                  if(!!this.profileImage && this.profileImage.size > 3000000){
                    this.dialog.open(DialogComponent, {
                      width: '500px',
                      data: {title : "Image size Issue", message : "Your profile image size is to big. Please select an image with less than 3 MB size."}
                    });
                    this.selectedProfileImage= null
                    return
                  }

                    this.uploadImage(this.userForm.get('email')?.value)
                    this.openSnackBar(" User updated successfully")
                    this.router.navigate(["/users"])

                   },
                  (error: any) => {  console.error('Error updating user', error);});
              }
              else {
                this.userService.updateUser(this.user.id, this.userForm).subscribe(
                  (response: any) => { 
                    this.router.navigate(["/users"])
                    this.openSnackBar("User updated successfully"); 
                  },
                  (error: any) => { console.error('Error updating user', error); }
                );
                
            }
            
            if(!!!this.profileImage && this.isProfileImageChanged){
              this.userService.deleteImage(this.user.id).subscribe({
                next : (response)  => {this.openSnackBar("Profile image removed.")},
                error : (error)  => {console.log("error deleting profile image :",error)}
              })
            }

            if( this.user.id === this.authService.getUser().id){
                  this.userService.connectedUserHasChanged = true   
                  console.log("connected user changed !")
             }
            
          }else {
            this.userService.createUser(this.userForm.value).subscribe({
              next : (response: any) => {  
                    if(!response.id){
                      this.dialog.open(DialogComponent, {
                        width: '500px',
                        data: {title : "User Already Exist", message : " An User with this email already exist. Please Modify that user or change your email."}
                      });


                    }else{
                      this.router.navigate(["/users"])
                      this.openSnackBar(" New User Created successfully") 
                    } 
              },
              error : (error: any) => { console.error('Error creating user', error); } 
            })
          }
        }
      })
      }
    
    }

    uploadImage(username : string) {
      if (!this.profileImage) {
        console.error('No file selected.');
        return ;
      }

  
      const formData: FormData = new FormData();
      formData.append('imageFile', this.profileImage, this.profileImage.name);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
    });
      
      this.userService.uploadImage(formData, this.userForm.get('email')?.value, headers).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log('Image uploaded successfully.');
            this.openSnackBar("User updated successfully !!");
          } else {
            console.log("response handling issue ")
          }
        },
        (error: any) => {
          console.error('Image upload failed:', error);
          // Handle upload error
        }
      );
      
    }
  

  deleteUser(){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete User ?", content : `Are you sure you want to delete user ${this.user.firstName} ${this.user.lastName}?`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){
        this.userService.deleteUser(this.user.id).subscribe({
          next : (response) => { 
            this.user = {  id : '', email : '', gender : '', firstName : '', lastName : '',  password : '',  post : '',  role : [],  profile : null}
            this.openSnackBar("User deleted successfully !!")
            this.userDeleted.emit();
            this.router.navigate(["/users"])
          },
          error : (error) => { console.log(error) }
        })
      }
    })
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }
  
  deleteProfile(){
    this.selectedProfileImage = null;
    this.user.profile = null;
    this.isProfileImageChanged = true;
    
  }
 
  }
