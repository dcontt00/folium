import Component from "./component"
import mongoose from "mongoose";

export default interface IPortfolio {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    url: string;
    components: Component[];
}