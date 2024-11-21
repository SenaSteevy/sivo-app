import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource } from 'src/models/Resource';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.css']
})
export class EditResourceComponent implements OnInit {

  resource ! : Resource

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
      this.jobService.getResourceById(id).subscribe({
        next: (response : Resource) => {
          this.resource = response;
        },
        error: (error: any) => {
          console.log("error loading resource by id: ", error);
        }
      });  
    }
  }

}
