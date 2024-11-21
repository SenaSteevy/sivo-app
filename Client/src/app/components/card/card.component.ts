import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  pulseAnimation } from 'src/app/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations:[ 
    pulseAnimation,
    
    trigger('slideAnimation', [
      transition('* => *', animate('8000ms ease', keyframes([
        style({opacity : 0, transform : 'translateX(300px)', offset : 0}),
        style({opacity : 0.5, transform : 'translateX(100px)', offset : 0.5}),
        style({opacity : 1, transform : 'translateX(0px)', offset : 1})
      ])))
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input() title : any
  @Input() image : any
  @Input() description : any
  @Input() icon : any

  onHover : boolean 
  cardState: 'initial' | 'pulse' = 'initial';

  constructor() {
    this.onHover = false
   }

  ngOnInit(): void {
  }

  startAnimation() {
    this.cardState = 'pulse';
    this.onHover = true
  }

  stopAnimation() {
    this.cardState = 'initial';
    this.onHover = false

}
}