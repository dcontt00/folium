import ComponentModel from "./ComponentModel";
import {ImageComponentSchema} from "@/schemas";

const ImageComponentModel = ComponentModel.discriminator("ImageComponent", ImageComponentSchema);

export default ImageComponentModel;