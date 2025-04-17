import ComponentModel from "./ComponentModel";
import {TextComponentSchema} from "@/schemas";

const TextComponentModel = ComponentModel.discriminator("TextComponent", TextComponentSchema);

export default TextComponentModel;