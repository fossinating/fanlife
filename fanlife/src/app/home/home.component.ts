import { Component, OnInit } from '@angular/core';
import { GamemanagerService } from '../gamemanager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private gameMgr: GamemanagerService) { }

  ngOnInit(): void {
  }

  nextBtn(): void {
    this.gameMgr.nextEvent();
  }

}
