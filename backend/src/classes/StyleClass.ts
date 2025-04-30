export default class StyleClass {
    _id: string;
    identifier: string;
    textFont: string;
    backgroundColor: string;
    display: string;
    imageWidth: number;
    imageOverlayTransparency: number;
    buttonColor: string;
    flexDirection: string;
    alignItems: string;
    justifyContent: string;
    marginTop: string;
    textAlign: string;
    fontSize: string;
    position: string;
    top: string;
    left: string;
    right: string;
    bottom: string;

    constructor(_id: string, identifier: string, textFont: string, backgroundColor: string, display: string, imageWidth: number, imageOverlayTransparency: number, buttonColor: string, flexDirection: string, alignItems: string, justifyContent: string, marginTop: string, textAlign: string, fontSize: string, position: string, top: string, left: string, right: string, bottom: string) {
        this._id = _id;
        this.backgroundColor = backgroundColor;
        this.display = display;
        this.identifier = identifier;
        this.textFont = textFont;
        this.imageWidth = imageWidth;
        this.imageOverlayTransparency = imageOverlayTransparency;
        this.buttonColor = buttonColor;
        this.flexDirection = flexDirection;
        this.alignItems = alignItems;
        this.justifyContent = justifyContent;
        this.marginTop = marginTop;
        this.textAlign = textAlign;
        this.fontSize = fontSize;
        this.position = position;
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
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
        if (this.buttonColor) {
            style += `background-color: ${this.buttonColor};`
        }
        if (this.flexDirection) {
            style += `flex-direction: ${this.flexDirection};`
        }
        if (this.alignItems) {
            style += `align-items: ${this.alignItems};`
        }
        if (this.justifyContent) {
            style += `justify-content: ${this.justifyContent};`
        }
        if (this.marginTop) {
            style += `margin-top: ${this.marginTop};`
        }
        if (this.textAlign) {
            style += `text-align: ${this.textAlign};`
        }
        if (this.fontSize) {
            style += `font-size: ${this.fontSize};`
        }
        if (this.position) {
            style += `position: ${this.position};`
        }
        if (this.top) {
            style += `top: ${this.top};`
        }
        if (this.left) {
            style += `left: ${this.left};`
        }
        if (this.right) {
            style += `right: ${this.right};`
        }
        if (this.bottom) {
            style += `bottom: ${this.bottom};`
        }
        style += `}`
        return style
    }
}