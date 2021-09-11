import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]
  ),
  transition(':leave',
    [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]
  )
]);
const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true}
    )
  ])
]);
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  animations: [listAnimation,fadeAnimation]
})
export class DefaultComponent implements OnInit {

  sideBarOpen = false;
  menuMoble=false;
  constructor() { }

  ngOnInit() { }


  sideBarToggler(event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  sideBarTogglerMoblie(event) {
    this.menuMoble = !this.menuMoble;
  }

}
