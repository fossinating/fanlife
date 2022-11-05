export class Glog {
    public logText: string;
    public isMajor: boolean;

    constructor(logText: string, isMajor: boolean) {
        this.logText = logText;
        this.isMajor = isMajor;
    }
}