import type {
    ButtonComponentType,
    ComponentType,
    ContainerComponentType,
    ImageComponentType,
    TextComponentType
} from "~/interfaces/interfaces";
import TextComponent from "~/components/portfolioComponents/TextComponent";
import ButtonComponent from "~/components/portfolioComponents/ButtonComponent";
import ImageComponent from "~/components/portfolioComponents/ImageComponent";
import ContainerComponent from "~/components/portfolioComponents/ContainerComponent";
import type StyleClass from "~/interfaces/styleClass";

interface Props {
    component: ComponentType;
    styleClass:StyleClass
}

export default function Component({component, styleClass}: Props) {
    function renderComponent(component: ComponentType) {

        switch (component.__t) {
            case "TextComponent":
                const textComponent = component as TextComponentType;
                return <TextComponent styleClass={styleClass} textComponent={textComponent}/>

            case "ButtonComponent":
                const buttonComponent = component as ButtonComponentType;
                return <ButtonComponent buttonComponent={buttonComponent}/>

            case "ImageComponent":
                const imageComponent = component as ImageComponentType;
                return <ImageComponent imageComponent={imageComponent} styleClass={styleClass}/>

            case "ContainerComponent":
                const containerComponent = component as ContainerComponentType;
                return <ContainerComponent containerComponent={containerComponent} styleClass={styleClass}/>
            default:
                console.log(component)
                return <div>Component not found</div>
        }
    }

    return renderComponent(component)
}