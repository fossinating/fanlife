import { Effect } from "./effect";

export class Gact {
    public label: string;
    public effects: Effect[];

    constructor(label: string, effects: Effect[]) {
        this.label = label;
        this.effects = effects;
    }
}