import { Component, OnInit } from '@angular/core';
import { Glog } from './glog';
import { GameLogsService } from './glogs.service';

@Component({
  selector: 'app-gamelog',
  templateUrl: './gamelog.component.html',
  styleUrls: ['./gamelog.component.scss']
})
export class GamelogComponent implements OnInit {

  gameLogs: Glog[] = [
    new Glog("Age: 420", true),
    new Glog("You did a thing", false),
    new Glog("Blah blah", false),
    new Glog("Boneless pizza", false),
    new Glog("Age: 6900", true),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("Age: 420000", true),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
    new Glog("filler data", false),
  ];

  constructor(private glogService: GameLogsService) { }

  ngOnInit(): void {
    this.gameLogs = this.glogService.getGlogs();
  }

  addEvent() {
    this.glogService.addGlog("RANDOM NEW EVENT", false);
  }

}
