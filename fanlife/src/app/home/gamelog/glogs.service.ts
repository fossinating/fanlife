import { Injectable } from "@angular/core";
import { Glog } from "./glog";

@Injectable({
    providedIn: 'root',
})
export class GameLogsService {
    private glogs: Glog[];
    
    constructor() {
        this.glogs = [];
    }

    addGlog(text: string, isMajor: boolean) {
        this.glogs.push(new Glog(text, isMajor));
    }

    getGlogs(): Glog[] {
        return this.glogs;
    }
}