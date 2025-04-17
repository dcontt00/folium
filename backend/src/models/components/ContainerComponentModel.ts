import ComponentModel from "./ComponentModel";
import IContainerComponent from "@/interfaces/IContainerComponent";
import {ContainerComponentSchema} from "@/schemas";


const ContainerComponentModel = ComponentModel.discriminator<IContainerComponent>("ContainerComponent", ContainerComponentSchema);

export default ContainerComponentModel;