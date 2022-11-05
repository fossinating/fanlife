import { Component, OnInit } from '@angular/core';
import { Effect } from './effect';
import { Gact } from './gact';
import { GameActivitiesService } from './gacts.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activityList: Gact[];

  constructor(private gactService: GameActivitiesService) {
    this.activityList = gactService.getActivities();
  }

  ngOnInit(): void {
    this.gactService.addActivity("Yeet a dood out the window", [new Effect("beef", 12)]);
    this.gactService.addActivity("eat sum pie", [new Effect("ff", 33)]);
    this.gactService.addActivity("say bruh", [new Effect("aa", 22)]);
  }

}
