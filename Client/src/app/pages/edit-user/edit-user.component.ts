import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileHandle } from 'src/models/FileHandle';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user : any
  icon : string = "group"
  title : string = "New User"

  constructor( private userService: UserService, 
    private activatedRoute : ActivatedRoute,
    private sanitizer : DomSanitizer ){  }

  checkIfUserById() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
  
    if(id){

      this.userService.getUserById(id).subscribe({
        next: (response) => {
          this.user = response;

          this.userService.getImage(this.user.email).subscribe(
            (res: any) => {
              if (res && res.picByte) {
                const file: File = new File([res.picByte], res.name, { type: res.type });
                const url: string = 'data:image/jpeg;base64,' + res.picByte;
                const fileHandle: FileHandle = { file :file, 
                  url :this.sanitizer.bypassSecurityTrustUrl(url) };
                this.user.profile = fileHandle;
                console.log("image profile retrieved")
              } else {
                this.user.profile = null;
              }
            },
            (error : any ) => {
              console.error(error);
            }
          );
          
          if(this.activatedRoute.snapshot.url.join("/").includes("profile")){
            this.icon = "account_circle"
            this.title = "Profile"
          }else{
            this.title = "Users > Edit user > "+this.user.firstName+" "+this.user.lastName
          }
        },
        error: (error: any) => {
          console.log("error loading user by id: ", error);
        }
      });  

     
    }

  
  }



  ngOnInit(): void {
    this.checkIfUserById()
  }

}
