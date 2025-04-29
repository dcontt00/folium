export default class StyleClass {
    _id: string;
    identifier: string;
    textFont: string;
    backgroundColor: string;
    display: string;
    imageWidth: number;
    imageOverlayTransparency: number;

    constructor(_id: string, identifier: string, textFont: string, backgroundColor: string, display: string, imageWidth: number, imageOverlayTransparency: number) {
        this._id = _id;
        this.backgroundColor = backgroundColor;
        this.display = display;
        this.identifier = identifier;
        this.textFont = textFont;
        this.imageWidth = imageWidth;
        this.imageOverlayTransparency = imageOverlayTransparency;
    }


    toString() {
        let style = ''
        style += `.${this.identifier} {`
        if (this.backgroundColor) {
            style += `background-color: ${this.backgroundColor};`
        }
        if (this.textFont) {
            style += `font-family: ${this.textFont};`
        }
        if (this.display) {
            style += `display: ${this.display};`
        }
        if (this.imageWidth) {
            style += `width: ${this.imageWidth}%;`
        }
        if (this.imageOverlayTransparency) {
            style += `backgroundColor:rgba(0, 0, 0, ${this.imageOverlayTransparency / 100} );`
        }
        style += `}`

        return style
    }
}