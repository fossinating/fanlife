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
    this.playerName = '';
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
