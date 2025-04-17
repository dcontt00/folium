import {componentModel} from "@/models";
import buttonComponentSchema from "@/schemas/components/ButtonComponentSchema";

const buttonComponentModel = componentModel.discriminator("ButtonComponent", buttonComponentSchema)

export default buttonComponentModel;