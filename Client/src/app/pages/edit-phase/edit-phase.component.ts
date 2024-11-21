import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Phase } from 'src/models/Phase';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-edit-phase',
  templateUrl: './edit-phase.component.html',
  styleUrls: ['./edit-phase.component.css']
})
export class EditPhaseComponent implements OnInit {

  phase ! : Phase

  constructor(
    private jobService :JobService,
    private activatedRoute : ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.checkIfOrderById()
  }

  checkIfOrderById(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')

    if(id){
      this.jobService.getPhaseById(id).subscribe({
        next: (response : Phase) => {
          this.phase = response;
        },
        error: (error: any) => {
          console.log("error loading phase by id: ", error);
        }
      });  
    }
  }

}
