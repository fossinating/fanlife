import { Component, OnInit } from '@angular/core';
import { Gstat } from './gstat';
import { GameStatsService } from './gstats.service';

@Component({
  selector: 'app-gamestats',
  templateUrl: './gamestats.component.html',
  styleUrls: ['./gamestats.component.scss']
})
export class GamestatsComponent implements OnInit {

  gameStats: {[name: string]: Gstat};

  constructor(private gstatService: GameStatsService) {
    this.gameStats = gstatService.getGameStats();
  }

  ngOnInit(): void {
    
  }

}
