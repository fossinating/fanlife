import { Component, OnInit } from '@angular/core';
import { Universe } from './universe';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private universeCollection: AngularFirestoreCollection<Item>;
  private index: Item;
  universeList: Universe[];
  isLoading: boolean;

  constructor(private firestore: AngularFirestore) {
    this.universeList = [];
    this.isLoading = true;
    this.universeCollection = firestore.collection<Item>('universes');
    this.index = {name: ""};

    this.universeCollection.doc('index').ref.get().then(got => {
      const indexData = got.data();
      if (indexData) {
        this.index = indexData;
        console.log(this.index);
        // now update universe list
        this.universeList = [];
        let k: keyof typeof indexData;
        for (k in indexData) {
          this.universeList.push(new Universe(indexData[k], k));
        }
        this.isLoading = false;
      }
    });

    this.universeList = [
      new Universe("Loading universes...", ''),
    ]
  }

  ngOnInit(): void {
  }

}
