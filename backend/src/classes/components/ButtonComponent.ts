import Component from "@/classes/components/Component";

export default class ButtonComponent extends Component {
    text: string;
    url: string;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, text: string, url: string) {
        super(_id, __t, componentId, index, parent_id, className);
        this.text = text;
        this.url = url;
    }

    toHtml() {
        return `
<button class="${this.className}" onclick=${this.url}"> ${this.text}</button>

`;
    }

}