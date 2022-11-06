import { Component } from '@angular/core';
import { nameHolder, PlayernameService } from './name/playername.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fanlife';
  playerName: nameHolder;
  constructor(private nameService: PlayernameService) {
    this.playerName = nameService.getName();
  }
}
