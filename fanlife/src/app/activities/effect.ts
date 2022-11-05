export class Effect {
    public attribute: string;
    public modBy: number;

    constructor(attribute: string, modBy: number) {
        this.attribute = attribute;
        this.modBy = modBy;
    }
}