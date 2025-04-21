import Component from "@/classes/components/Component";

export default class ButtonComponent extends Component {
    text: string;
    color: string;
    url: string;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, text: string, color: string, url: string) {
        super(_id, __t, componentId, index, parent_id);
        this.text = text;
        this.color = color;
        this.url = url;
    }

    toHtml() {
        return `<button style="background-color: ${this.color};">${this.text}</button>`;
    }

}