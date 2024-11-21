import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Treatment } from 'src/models/Treatment';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-edit-treatment',
  templateUrl: './edit-treatment.component.html',
  styleUrls: ['./edit-treatment.component.css']
})
export class EditTreatmentComponent implements OnInit {


  treatment ! : Treatment

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
      this.jobService.getTreatmentById(id).subscribe({
        next: (response : Treatment) => {
          this.treatment = response;
        },
        error: (error: any) => {
          console.log("error loading treatment by id: ", error);
        }
      });  
    }
  }


}
