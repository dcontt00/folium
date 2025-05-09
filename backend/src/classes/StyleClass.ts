export default class StyleClass {
    _id: string;
    identifier: string;
    textFont: string;
    backgroundColor: string;
    display: string;
    width: number;
    imageOverlayTransparency: number;
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
    border: string;
    padding: string;
    transition: string;
    transform: string;
    cursor: string;
    borderRadius: string;
    gap: string;
    color: string;

    constructor(
        _id: string,
        identifier: string,
        textFont: string,
        backgroundColor: string,
        display: string,
        width: number,
        imageOverlayTransparency: number,
        flexDirection: string,
        alignItems: string,
        justifyContent: string,
        marginTop: string,
        textAlign: string,
        fontSize: string,
        position: string,
        top: string,
        left: string,
        right: string,
        bottom: string,
        border: string,
        padding: string,
        transition: string,
        transform: string,
        cursor: string,
        borderRadius: string,
        gap: string,
        color: string
    ) {
        this._id = _id;
        this.backgroundColor = backgroundColor;
        this.display = display;
        this.identifier = identifier;
        this.textFont = textFont;
        this.width = width;
        this.imageOverlayTransparency = imageOverlayTransparency;
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
        this.border = border;
        this.padding = padding;
        this.transition = transition;
        this.transform = transform;
        this.cursor = cursor;
        this.borderRadius = borderRadius;
        this.gap = gap;
        this.color = color;
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
        if (this.width) {
            console.log(this.width)
            style += `width: ${this.width};`
        }
        if (this.imageOverlayTransparency) {
            style += `background-color:rgba(0, 0, 0, ${this.imageOverlayTransparency} );`
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
        if (this.border) {
            style += `border: ${this.border};`
        }
        if (this.padding) {
            style += `padding: ${this.padding};`
        }
        if (this.transition) {
            style += `transition: ${this.transition};`
        }
        if (this.transform) {
            style += `transform: ${this.transform};`
        }
        if (this.cursor) {
            style += `cursor: ${this.cursor};`
        }
        if (this.borderRadius) {
            style += `border-radius: ${this.borderRadius};`
        }
        if (this.gap) {
            style += `gap: ${this.gap};`
        }
        if (this.color) {
            style += `color: ${this.color};`
        }

        style += `}`
        return style
    }
}