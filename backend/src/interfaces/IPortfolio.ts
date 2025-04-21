import mongoose from "mongoose";
import Component from "@/classes/components/Component";

export default interface IPortfolio {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    url: string;
    components: Component[];
}