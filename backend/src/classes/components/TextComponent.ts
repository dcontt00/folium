import TextType from "@/interfaces/TextType";
import Component from "@/classes/components/Component";

export default class TextComponent extends Component {
    text: string;
    fontSize: number;
    type: TextType

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, text: string, fontSize: number, textType: TextType) {
        super(_id, __t, componentId, index, parent_id, className);
        this.text = text;
        this.fontSize = fontSize;
        this.type = textType;
    }

    toHtml() {
        return `<${this.type} class="${this.className}">${this.text}</${this.type}>`;
    }
}