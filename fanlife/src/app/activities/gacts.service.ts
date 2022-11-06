import { Injectable } from "@angular/core";
import { Effect } from "./effect";
import { Gact } from "./gact";

@Injectable({
    providedIn: 'root',
})
export class GameActivitiesService {
    private activities: Gact[];

    constructor() {
        this.activities = [];
    }

    getActivities(): Gact[] {
        return this.activities;
    }

    addActivity(label: string, event: string) {
        this.activities.push(new Gact(label, event));
    }

    clearActivities() {
        this.activities = [];
    }
}