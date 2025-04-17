import componentModel from "./componentModel";
import {ImageComponentSchema} from "@/schemas";

const imageComponentModel = componentModel.discriminator("ImageComponent", ImageComponentSchema);

export default imageComponentModel;