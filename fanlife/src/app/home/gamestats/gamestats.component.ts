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
    /*this.gstatService.addStat(0, 100, 69, "nice", true);
    this.gstatService.addStat(0, 100, 44, "forty four", true);
    this.gstatService.addStat(0, 100, 2, "NOT VISIBLE", false);
    this.gstatService.addStat(0, 100, 11, "visible", true);*/
  }

}
