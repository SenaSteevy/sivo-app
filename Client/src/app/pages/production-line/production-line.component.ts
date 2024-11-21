import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Phase } from 'src/models/Phase';
import { JobService } from 'src/services/jobService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-line',
  templateUrl: './production-line.component.html',
  styleUrls: ['./production-line.component.css']
})
export class ProductionLineComponent implements OnInit {

  phaseList: Phase[] = [  ];
  error = false;
 
  constructor(private jobService : JobService, private router : Router) {
    
    this.jobService.getAllPhases().subscribe({
      next :(response : Phase[]) => {
        this.phaseList = response
      },
      error : (error) =>{
        console.log("error getting phasList",error);
      error=true;}
    })
   }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<Phase[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.phaseList, event.previousIndex, event.currentIndex);
    }
  }

  newPhase(){
    this.router.navigate(["production-line/phases/new"])
  }

}
