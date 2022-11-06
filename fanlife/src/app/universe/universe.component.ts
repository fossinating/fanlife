import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { assert } from '@firebase/util';
import { Effect } from '../activities/effect';
import { Gact } from '../activities/gact';
import { GameActivitiesService } from '../activities/gacts.service';
import { GamemanagerService } from '../gamemanager.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayernameService } from '../name/playername.service';

export interface Item { name: string }
export interface DialogData { playerName: string }

@Component({
  selector: 'app-universe',
  templateUrl: './universe.component.html',
  styleUrls: ['./universe.component.scss']
})
export class UniverseComponent implements OnInit {
  isActivitiesOpen: boolean;
  activityList: Gact[];
  universeId: string;
  playerName: string;
  isDead: boolean;
  isLoading: boolean;

  constructor(private gameMgr: GamemanagerService,
              private route: ActivatedRoute,
              private activityService: GameActivitiesService,
              private firestore: AngularFirestore,
              private dialog: MatDialog,
              private nameService: PlayernameService,
              private html: ElementRef)
  {
    const id = this.route.snapshot.paramMap.get('id');
    this.universeId = id ? id : 'UNDEFINED';
    this.isActivitiesOpen = false;
    this.activityList = activityService.getActivities();
    this.playerName = ''
    this.isDead = false;
    this.isLoading = true;

    // grab universe info from db
    let universeCollection = firestore.collection<Item>('universes');
    universeCollection.doc(this.universeId).ref.get().then(got => {
      const universeData = got.data();
      if (universeData) {
        console.log(universeData);
        this.isLoading = false;
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
    this.openDialog();
  }

  nextBtn(): void {
    this.gameMgr.nextEvent();
    setTimeout(() => {
      const el = this.html.nativeElement.querySelector('app-gamelog').parentElement;
      console.log(el);
      el.scrollTop = el.scrollHeight;
    }, 100)
  }

  openActivities(): void {
    this.isActivitiesOpen = true;

    this.activityService.clearActivities();

    let activities = this.gameMgr.getUniverseData().activities
    let k: keyof typeof activities;
    for (k in activities) {
      let disabled = false;
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
      if (activity.hasOwnProperty("disable_on")) {
        let d_k: any
        if (activity["disable_on" as keyof typeof activity] != undefined){
          console.log(activity["disable_on" as keyof typeof activity])
          for (let disable_on of (activity["disable_on" as keyof typeof activity] as Array<{[key: string]: any, type: string}>)){
            console.log(disable_on["value"])
            if (disable_on.type == "next_event_in") {
              console.log(this.gameMgr.get_next_event())
              console.log(disable_on["value"].includes(this.gameMgr.get_next_event()))
              disabled = disable_on["value"].includes(this.gameMgr.get_next_event())
              if (disabled){
                console.log("disabling")
                break;
              }
            }
          }
        }
      }
      this.activityService.addActivity(activity.name, activity.event, disabled);
    }

  }
  closeActivities(): void {
    this.isActivitiesOpen = false;
  }

  clickActivity(event: string) {
    this.isActivitiesOpen = false;
    this.gameMgr.runEvent(event);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NameDialog, {
      width: '400px',
      data: {name: this.playerName}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // non empty name, set it!
        this.playerName = result;
        this.nameService.setName(this.playerName);
      } else {
        this.playerName = 'Glup Schitto';
        this.nameService.setName('Glup Schitto');
      }
    });
  }

}

@Component({
  selector: 'name-dialog',
  templateUrl: 'name-dialog.html',
})
export class NameDialog {
  constructor(public dialogRef: MatDialogRef<NameDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
