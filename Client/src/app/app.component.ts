import { Component, DoCheck, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileHandle } from 'src/models/FileHandle';
import { AuthService } from 'src/services/authService';
import { UserService } from 'src/services/userService';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck{
  menus = [
    {
      icon: 'home',
      label: 'Home',
      items: [ ]
    },
    {
      icon: 'date_range',
      label: 'Plannings',
      items: [
        {
          routerLink: '/simulator',
          icon: 'play_arrow',
          label: 'Planning Simulator'
        },
        {
          routerLink: '/schedules',
          icon: 'list_alt',
          label: 'All Plannings'
        },
        {
          routerLink: '/schedules/new',
          icon: 'add',
          label: 'New Planning'
        }
      ]
    },
    {
      icon : 'group',
      label : 'Users',
      items :[
        {
        routerLink: '/users',
        icon: 'list_alt',
        label: 'All users'

        },
        {
          routerLink: '/users/new',
          icon: 'person_add',
          label: 'Add new user'
  
          },
          {
            routerLink: '/roles',
            icon: 'accessibility',
            label: 'Roles Details'
            },
            {
              routerLink: '/register-requests',
              icon: 'contacts',
              label: 'Register Requests'
              }
      ]
    },
    {
      icon : 'contacts',
      label : 'Clients',
      items :[
        {
        routerLink: '/clients',
        icon: 'list_alt',
        label: 'All Clients'
        },
        {
          routerLink: '/clients/new',
          icon: 'add',
          label: 'Add new clients'
          }
      ]
    },
    {
      icon : 'receipt',
      label : 'Orders',
      items :[
        {
        routerLink: '/orders',
        icon: 'list',
        label: 'All Orders'
        },
        {
          routerLink: '/orders/new',
          icon: 'add',
          label: 'New Order'
          }
      ]
    },
    {
      icon : 'domain',
      label : 'Stocks',
      items :[
        {
        routerLink: '/resources',
        icon: 'list_alt',
        label: 'Resources in stocks'
        },
        {
          routerLink: '/resources/new',
          icon: 'add',
          label: 'New Stock'
          }
      ]
    },
    {
      icon : 'factory',
      label : 'Production Line',
      items :[
        {
        routerLink: '/production-line',
        icon: 'settings_input_component',
        label: 'Production phases'
        },
        {
          routerLink: '/production-line/phases/new',
          icon: 'add',
          label: 'Add New Phase'
          },
        {
          routerLink: 'production-line/treatments',
          icon: 'widgets',
          label: 'ALL Treatments'
          },{
            routerLink: 'production-line/treatments/new',
            icon: 'add',
            label: 'Add New Treatments'
            }
      ]
    },
    {
      icon : 'settings',
      label : 'Settings',
      items : []
    }
  ];
  

  connectedUser : any
  constructor(private authService : AuthService, 
    private router : Router, 
    private dialog : MatDialog,
    private userService : UserService,
    private sanitizer : DomSanitizer){
    this.connectedUser = this.authService.getUser();
  }
  ngOnInit(): void {

    this.loadProfileImage()
   
  }
  ngDoCheck(): void {
    const user = this.authService.getUser()
    if (user != undefined) {
      this.connectedUser = user;
    }
    if(this.userService.connectedUserHasChanged){
      setTimeout(() => {
        this.loadProfileImage()
      }, 2000);
    }

  }
  
  loadProfileImage() : void {
    if( this.connectedUser)
    this.userService.getImage(this.connectedUser.email).subscribe(
      (res: any) => {
        if (res && res.picByte) {
          const file: File = new File([res.picByte], res.name, { type: res.type });
          const url: string = 'data:image/jpeg;base64,' + res.picByte;
          const fileHandle: FileHandle = { file :file, 
            url :this.sanitizer.bypassSecurityTrustUrl(url) };
          this.connectedUser.profile = fileHandle;
        } else {
          this.connectedUser.profile = null;
        }
      },
      (error : any ) => {
        console.log("error getting image",error);
      }
      );
      this.userService.connectedUserHasChanged = false;
  }

  Disconnect() : void {
    let data = { title: "LOG OUT", content: `Are you sure you want to log out ?` }
       
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: data
        });
    
        dialogRef.afterClosed().subscribe((result : string) => {

          if(result=="yes"){
            this.connectedUser = undefined;
            this.authService.clear();
            this.router.navigate(["/login"]);
          }
        });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

 
}
