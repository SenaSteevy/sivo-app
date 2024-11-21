import { Component, OnInit } from '@angular/core';
import { pulseAnimation } from 'src/app/animations';
import { Role } from 'src/models/Role';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  animations : [pulseAnimation]
})
export class RolesComponent implements OnInit {

  roleList :Role[] = []
  loading :boolean = true
  cardState : {[id : number ] : string} = {}
  onHover :{[id : number ] : boolean} = {}

  constructor(private userService : UserService) { 
  }

  ngOnInit(): void {
    this.getAllRoles()
  }

  getAllRoles() {
    this.userService.getAllRoles().subscribe(
      (response: Role[]) => {
        this.roleList = response;
        this.roleList.forEach((role)=> {
          this.cardState[role.id] = 'initial'
          this.onHover[role.id] = false
        })
        this.loading = false
      },
      (error: any) => {
        console.log("error loading roles: ", error);
      }
    );
  }

  startAnimation(id : number) {
    this.cardState[id] = 'pulse';
    this.onHover[id] = true
  }

  stopAnimation(id : number) {
    this.cardState[id] = 'initial';
    this.onHover[id] = false

}
}
