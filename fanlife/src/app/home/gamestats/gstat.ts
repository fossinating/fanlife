export class Gstat {
    public min: number;
    public max: number;
    public value: number;
    public label: string;

    constructor(min: number, max: number, value: number, label: string) {
        this.min = min;
        this.max = max;
        this.value = value;
        this.label = label;
    }
}