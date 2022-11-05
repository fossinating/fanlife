import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Effect } from '../activities/effect';
import { Gact } from '../activities/gact';
import { GameActivitiesService } from '../activities/gacts.service';
import { GamemanagerService } from '../gamemanager.service';

@Component({
  selector: 'app-universe',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {

  isActivitiesOpen: boolean;
  activityList: Gact[];

  constructor(private gameMgr: GamemanagerService,
              private route: ActivatedRoute,
              private activityService: GameActivitiesService)
  {
    //console.log(this.route.snapshot.paramMap.get("id"));
    this.isActivitiesOpen = false;
    this.activityList = activityService.getActivities();

    this.activityService.addActivity("Yeet a dood out the window", [new Effect("beef", 12)]);
    this.activityService.addActivity("eat sum pie", [new Effect("ff", 33)]);
    this.activityService.addActivity("say bruh", [new Effect("aa", 22)]);
  }

  ngOnInit(): void {
  }

  nextBtn(): void {
    this.gameMgr.nextEvent();
  }

  openActivities(): void {
    this.isActivitiesOpen = true;
  }
  closeActivities(): void {
    this.isActivitiesOpen = false;
  }

}
