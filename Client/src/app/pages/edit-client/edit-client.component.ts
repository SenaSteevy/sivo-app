import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/models/Client';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  client ! : Client

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
      this.jobService.getClientById(id).subscribe({
        next: (response : Client) => {
          this.client = response;
        },
        error: (error: any) => {
          console.log("error loading client by id: ", error);
        }
      });  
    }
  }


}
