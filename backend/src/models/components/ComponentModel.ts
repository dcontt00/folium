import mongoose from "mongoose";
import Component from "@/interfaces/component";
import {ComponentSchema} from "@/schemas";


const ComponentModel = mongoose.model<Component>('Component', ComponentSchema);

export default ComponentModel;