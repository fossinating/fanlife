import { Injectable } from '@angular/core';

export interface nameHolder { name: string }

@Injectable({
  providedIn: 'root'
})
export class PlayernameService {

  private playerName: nameHolder;

  constructor() {
    this.playerName = { name: '' };
  }

  getName(): nameHolder {
    return this.playerName;
  }

  setName(name: string) {
    this.playerName.name = name;
  }
}
