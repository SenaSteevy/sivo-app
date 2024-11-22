import { Component, DoCheck, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileHandle } from 'src/models/FileHandle';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
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
    }
  ];
  

  constructor( 
    private router : Router ){
  }
  ngOnInit(): void {

   
  }
  
 
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

 
}
