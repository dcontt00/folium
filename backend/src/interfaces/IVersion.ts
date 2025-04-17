import {IChange} from "@/IChange";
import Component from "@/component";
import mongoose from "mongoose";

export default interface IVersion extends Document {
    portfolioId: mongoose.Types.ObjectId;
    data: any;
    createdAt: Date;
    relativeCreatedAt: string
    changes: IChange[];
    components: Component[];
    title: string;
    description: string;
    url: string;
}