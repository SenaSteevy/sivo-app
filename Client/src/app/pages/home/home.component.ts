import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  loading : boolean = true;
  connectedUser: any;
  

  constructor(private userService : UserService) { }
  
  ngOnInit(): void {
    this.connectedUser = this.userService.connectedUser;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000); 
  }

}
