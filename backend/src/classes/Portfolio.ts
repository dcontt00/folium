import mongoose from "mongoose";

export default class Portfolio {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    url: string;
    user: mongoose.Schema.Types.ObjectId;
    components: any[];

    constructor(_id: mongoose.Types.ObjectId, title: string, description: string, url: string, user: mongoose.Schema.Types.ObjectId, components: any[]) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.components = components;
        this.url = url;
        this.user = user;
    }

    toHtml() {
        return `<h1>${this.title}</h1><p>${this.description} ${this.url}</p>`;
    }
}
