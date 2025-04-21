import mongoose from "mongoose";
import Component from "@/classes/components/Component";

export default class Portfolio {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    url: string;
    user: mongoose.Schema.Types.ObjectId;
    components: Component[];

    constructor(_id: mongoose.Types.ObjectId, title: string, description: string, url: string, user: mongoose.Schema.Types.ObjectId, components: Component[]) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.components = components;
        this.url = url;
        this.user = user;
    }

    toHtml() {
        return this.components.map(component => component.toHtml()).join("");
    }
}
