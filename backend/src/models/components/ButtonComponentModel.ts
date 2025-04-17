import ComponentModel from "./ComponentModel";
import buttonComponentSchema from "@/schemas/components/ButtonComponentSchema";

const ButtonComponentModel = ComponentModel.discriminator("ButtonComponent", buttonComponentSchema)

export default ButtonComponentModel;