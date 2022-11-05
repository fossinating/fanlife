import { Injectable } from '@angular/core';
import { GameActivitiesService } from './activities/gacts.service';
import { GameLogsService } from './home/gamelog/glogs.service';
import { GameStatsService } from './home/gamestats/gstats.service';

@Injectable({
  providedIn: 'root'
})
export class GamemanagerService {

  constructor(private activityService: GameActivitiesService,
              private logService: GameLogsService,
              private statService: GameStatsService) { }
}
