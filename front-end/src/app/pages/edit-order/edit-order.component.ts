import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from 'src/models/Job';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {
job! : Job
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
      this.jobService.getJobById(id).subscribe({
        next: (response : Job) => {
          this.job = response;
        },
        error: (error: any) => {
          console.log("error loading user by id: ", error);
        }
      });  
    }
  }


}
