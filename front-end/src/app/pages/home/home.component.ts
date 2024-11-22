import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  loading : boolean = true;
  

  constructor() { }
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000); 
  }

}
