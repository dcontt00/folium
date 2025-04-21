import {IChange} from "@/interfaces";
import mongoose from "mongoose";
import Component from "@/classes/components/Component";

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