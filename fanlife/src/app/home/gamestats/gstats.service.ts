import { Injectable } from "@angular/core";
import { Gstat } from "./gstat";

@Injectable({
    providedIn: 'root',
})
export class GameStatsService {
    private gameStats: {[name: string]: Gstat};

    constructor() {
        this.gameStats = {};
    }

    getGameStats(): {[name: string]: Gstat} {
        return this.gameStats;
    }

    getStat(name: string) {
        return this.gameStats[name];
    }

    addStat(min: number, max: number, initial: number, label: string, isVisible: boolean) {
        this.gameStats[label] = new Gstat(min, max, initial, label, isVisible);
    }

    clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    setStat(label: string, value: number) {
        if (label in this.gameStats){
            let stat = this.gameStats[label]
            this.gameStats[label].value = this.clamp(value, stat.min, stat.max);
        } else {
            console.error("Invalid stat " + label);
        }
    }

    modStat(label: string, modBy: number) {
        if (label in this.gameStats){
            let stat = this.gameStats[label]
            this.gameStats[label].value = this.clamp(stat.value + modBy, stat.min, stat.max);
        } else {
            console.error("Invalid stat " + label);
        }
    }
}