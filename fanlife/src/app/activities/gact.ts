
export class Gact {
    public label: string;
    public event: string;
    public disabled: boolean;

    constructor(label: string, event: string, disabled: boolean = false) {
        this.label = label;
        this.event = event;
        this.disabled = disabled;
    }
}