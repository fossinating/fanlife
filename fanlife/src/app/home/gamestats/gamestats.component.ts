import { Component, OnInit } from '@angular/core';
import { Gstat } from './gstat';

@Component({
  selector: 'app-gamestats',
  templateUrl: './gamestats.component.html',
  styleUrls: ['./gamestats.component.scss']
})
export class GamestatsComponent implements OnInit {

  gameStats: Gstat[] = [
    new Gstat(0, 100, 69, "nice"),
    new Gstat(0, 100, 44, "forty four"),
    new Gstat(0, 100, 3, "three"),
    new Gstat(0, 100, 96, "ninety six"),
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
