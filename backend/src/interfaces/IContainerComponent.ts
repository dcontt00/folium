import mongoose from "mongoose";

export default interface IContainerComponent extends Document {
    index: number;
    components: mongoose.Types.ObjectId[];
    parent_id: mongoose.Types.ObjectId;
}