import componentModel from "./componentModel";
import IContainerComponent from "@/interfaces/IContainerComponent";
import {ContainerComponentSchema} from "@/schemas";


const containerComponentModel = componentModel.discriminator<IContainerComponent>("ContainerComponent", ContainerComponentSchema);

export default containerComponentModel;