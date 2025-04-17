import mongoose from "mongoose";
import {IComponent} from "@/interfaces";
import {ComponentSchema} from "@/schemas";


const ComponentModel = mongoose.model<IComponent>('Component', ComponentSchema);

export default ComponentModel;