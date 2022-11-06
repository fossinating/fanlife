import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { assert } from '@firebase/util';
import { Effect } from '../activities/effect';
import { Gact } from '../activities/gact';
import { GameActivitiesService } from '../activities/gacts.service';
import { GamemanagerService } from '../gamemanager.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/compat/firestore';

export interface Item { name: string }

@Component({
  selector: 'app-universe',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {

  isActivitiesOpen: boolean;
  activityList: Gact[];
  universeId: string;

  constructor(private gameMgr: GamemanagerService,
              private route: ActivatedRoute,
              private activityService: GameActivitiesService,
              private firestore: AngularFirestore)
  {
    const id = this.route.snapshot.paramMap.get("id");
    this.universeId = id ? id : "UNDEFINED";
    this.isActivitiesOpen = false;
    this.activityList = activityService.getActivities();

    // grab universe info from db
    let universeCollection = firestore.collection<Item>('universes');
    universeCollection.doc(this.universeId).ref.get().then(got => {
      const universeData = got.data();
      if (universeData) {
        console.log(universeData);
        /*this.index = universeData;
        console.log(this.index);
        // now update universe list
        this.universeList = [];
        let k: keyof typeof universeData;
        for (k in universeData) {
          this.universeList.push(new Universe(universeData[k], k));
        }*/
      }
    });
  }

  ngOnInit(): void {
    // ask the user for their name
  }

  nextBtn(): void {
    this.gameMgr.nextEvent();
  }

  openActivities(): void {
    this.isActivitiesOpen = true;

    let activities = this.gameMgr.getUniverseData().activities
    let k: keyof typeof activities;
    for (k in activities) {
      const activity = activities[k];
      if (activity.hasOwnProperty("requirements")){
        let r_k: any
        let good: boolean = true;
        assert(activity.requirements != undefined, "AAAAAA");
        if (activity.requirements != undefined){
          for (r_k in activity.requirements) {
            const requirement: {type: string, attr: string, value: any} = activity.requirements?.[r_k];
            if (requirement.type == "attr") {
              if (this.gameMgr.getAttr(requirement.attr) != requirement.value) {
                good = false;
                break;
              }
            }
          }
          if (!good) {
            continue;
          }
        }
      }
      this.activityService.addActivity(activity.name, activity.event);
    }

  }
  closeActivities(): void {
    this.isActivitiesOpen = false;
  }

  clickActivity(event: string) {
    this.gameMgr.runEvent(event);
  }

}
