export default class StyleClass {
    _id: string;
    identifier: string;
    textFont: string;
    backgroundColor: string;
    display: string;

    constructor(_id: string, identifier: string, textFont: string, backgroundColor: string, display: string) {
        this._id = _id;
        this.backgroundColor = backgroundColor;
        this.display = display;
        this.identifier = identifier;
        this.textFont = textFont;
    }


   toString() {
        return `.${this.identifier}: {
            background-color: ${this.backgroundColor};
            font-family: ${this.textFont};
            display: ${this.display};
        }
        `
   }
}