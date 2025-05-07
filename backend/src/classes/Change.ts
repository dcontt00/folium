export default class Change {
    attribute: string;
    oldValue: string;
    newValue: string;

    constructor(attribute: string, oldValue: string, newValue: string) {
        this.attribute = attribute;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    toString(): string {
        let output = ""

        output += `${this.attribute}: ${this.oldValue} -> ${this.newValue}`;
        return output;
    }

    toJSON(): object {
        return {
            attribute: this.attribute,
            oldValue: this.oldValue,
            newValue: this.newValue
        }
    }
}