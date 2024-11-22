import { animate, state, style, transition, trigger } from '@angular/animations';


export let pulseAnimation = trigger('pulseAnimation', [
    state('pulse', style({ transform: 'scale(1.05)' })),
    transition('* <=> pulse', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
  ])