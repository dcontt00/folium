import mongoose from "mongoose";
import Component from "@/interfaces/component";
import {ComponentSchema} from "@/schemas";


const componentModel = mongoose.model<Component>('Component', ComponentSchema);

export default componentModel;