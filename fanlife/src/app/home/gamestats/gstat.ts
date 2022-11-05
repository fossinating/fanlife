export class Gstat {
    public min: number;
    public max: number;
    public value: number;
    public label: string;
    public isVisible: boolean;

    constructor(min: number, max: number, value: number, label: string, isVisible: boolean) {
        this.min = min;
        this.max = max;
        this.value = value;
        this.label = label;
        this.isVisible = isVisible;
    }
}