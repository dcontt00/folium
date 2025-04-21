import TextType from "@/interfaces/TextType";
import Component from "@/classes/components/Component";

export default class TextComponent extends Component {
    text: string;
    fontSize: string;
    color: string;
    type: TextType

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, text: string, fontSize: string, color: string, textType: TextType) {
        super(_id, __t, componentId, index, parent_id);
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.type = textType;
    }

    toHtml() {
        return `<${this.type} style="font-size: ${this.fontSize}; color: ${this.color};">${this.text}</${this.type}>`;
    }
}