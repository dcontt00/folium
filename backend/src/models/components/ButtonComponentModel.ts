import ComponentModel from "./ComponentModel";
import {ButtonComponentSchema} from "@/schemas";

const ButtonComponentModel = ComponentModel.discriminator("ButtonComponent", ButtonComponentSchema)

export default ButtonComponentModel;