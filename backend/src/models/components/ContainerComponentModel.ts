import ComponentModel from "./ComponentModel";
import {ContainerComponentSchema} from "@/schemas";
import {IContainerComponent} from "@/interfaces";


const ContainerComponentModel = ComponentModel.discriminator<IContainerComponent>("ContainerComponent", ContainerComponentSchema);

export default ContainerComponentModel;