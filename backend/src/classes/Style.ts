import StyleClass from "@/classes/StyleClass";
import {css as beautifyCss} from "js-beautify";

export default class Style {
    _id: string;
    classes: Map<string, StyleClass>;

    constructor(_id: string, classes: Map<string, StyleClass>) {
        this._id = _id;
        this.classes = classes;
    }

    toString() {
        let styleString = "";
        this.classes.forEach((styleClass) => {
            styleString += styleClass.toString();
        });
        return beautifyCss(styleString, {indent_size: 2});
    }

}
