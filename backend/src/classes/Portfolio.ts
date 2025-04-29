import mongoose from "mongoose";
import Component from "@/classes/components/Component";
import {html as beautifyHtml} from "js-beautify";


export default class Portfolio {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    url: string;
    user: mongoose.Schema.Types.ObjectId;
    components: Component[];
    style: mongoose.Schema.Types.ObjectId;

    constructor(_id: mongoose.Types.ObjectId, title: string, description: string, url: string, user: mongoose.Schema.Types.ObjectId, components: Component[], style: mongoose.Schema.Types.ObjectId) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.components = components;
        this.url = url;
        this.user = user;
        this.style = style;
    }

    toHtml() {
        const componentsHtml = this.components.map(component => component.toHtml()).join("");
        const rawHtml = `
        <html>

            <head>
                <title>Express</title>
                <link href="styles.css" rel="stylesheet">
            </head>
            <body>

                <div class="container">
                    ${componentsHtml}
                </div>
            </body>
        </html>
        `;
        return beautifyHtml(rawHtml, {indent_size: 2});
    }
}
