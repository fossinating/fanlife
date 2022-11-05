import { Injectable } from "@angular/core";
import { Gstat } from "./gstat";

@Injectable({
    providedIn: 'root',
})
export class GameStatsService {
    private gameStats: Gstat[];

    constructor() {
        this.gameStats = [];
    }

    getGameStats(): Gstat[] {
        return this.gameStats;
    }

    addStat(min: number, max: number, initial: number, label: string, isVisible: boolean) {
        this.gameStats.push(new Gstat(min, max, initial, label, isVisible));
    }

    editStat(label: string, value: number) {
        for (let stat of this.gameStats) {
            if (stat.label == label) {
                if (value > stat.min && value < stat.max) {
                    stat.value = value;
                }
            }
        }
    }
}