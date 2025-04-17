import {IChange, IComponent} from "@/interfaces";
import mongoose from "mongoose";

export default interface IVersion extends Document {
    portfolioId: mongoose.Types.ObjectId;
    data: any;
    createdAt: Date;
    relativeCreatedAt: string
    changes: IChange[];
    components: IComponent[];
    title: string;
    description: string;
    url: string;
}