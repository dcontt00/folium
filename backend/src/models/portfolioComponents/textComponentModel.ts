import componentModel from "./componentModel";
import {TextComponentSchema} from "@/schemas";

const textComponentModel = componentModel.discriminator("TextComponent", TextComponentSchema);

export default textComponentModel;