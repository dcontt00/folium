import mongoose from "mongoose";
import {ComponentSchema} from "@/schemas";


const ComponentModel = mongoose.model('Component', ComponentSchema);

export default ComponentModel;