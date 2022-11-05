import { Component, OnInit } from '@angular/core';
import { Universe } from './universe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  universeList: Universe[];

  constructor() {
    this.universeList = [
      new Universe("Star Wars", "beef"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
      new Universe("Placeholder", "yeet"),
    ]
  }

  ngOnInit(): void {
  }

}
