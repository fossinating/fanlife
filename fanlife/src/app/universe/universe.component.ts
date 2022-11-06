import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private gameMgr: GamemanagerService,
              private route: ActivatedRoute,
              private activityService: GameActivitiesService,
              private firestore: AngularFirestore,
              private dialog: MatDialog,
              private nameService: PlayernameService)
  {
    const id = this.route.snapshot.paramMap.get('id');
    this.universeId = id ? id : 'UNDEFINED';
    this.isActivitiesOpen = false;
    this.activityList = activityService.getActivities();
    this.playerName = '';

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

    this.activityService.addActivity("Yeet a dood out the window", [new Effect("beef", 12)]);
    this.activityService.addActivity("eat sum pie", [new Effect("ff", 33)]);
    this.activityService.addActivity("say bruh", [new Effect("aa", 22)]);
  }

  ngOnInit(): void {
    // ask the user for their name
    this.openDialog();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(NameDialog, {
      width: '400px',
      data: {name: this.playerName}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.playerName = result;
      this.nameService.setName(this.playerName);
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
