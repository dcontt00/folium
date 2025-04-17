export default class ButtonComponent {
    text: string;
    color: string;
    url: string;

    constructor(text: string, color: string, url: string) {
        this.text = text;
        this.color = color;
        this.url = url;
    }

    toHtml() {
        return `<button style="background-color: ${this.color};">${this.text}</button>`;
    }

}