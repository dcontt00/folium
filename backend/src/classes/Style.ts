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

        // Add p and H font sizes
        styleString += `
            h1 {
                font-size: 2.8rem;
                margin: 0;
            }
            h2 {
                font-size: 2.5rem;
                margin: 0;
            }
            h3 {
                font-size: 2.2rem;
                margin: 0;
            }
            h4 {
                font-size: 1.9rem;
                margin: 0;
            }
            h5 {
                font-size: 1.6rem;
                margin: 0;
            }
            h6 {
                font-size: 1.3rem;
                margin: 0;
            }
            p {
                font-size: 1rem;
                margin: 0;
            }
        `;

        this.classes.forEach((styleClass) => {
            styleString += styleClass.toString();
        });
        return beautifyCss(styleString, {indent_size: 2});
    }

}
