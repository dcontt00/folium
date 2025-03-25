import type {
    ButtonComponentType,
    ComponentType,
    ImageComponentType,
    TextComponentType
} from "../../../../common/interfaces/interfaces";
import TextComponent from "~/components/components/TextComponent";
import ButtonComponent from "~/components/components/ButtonComponent";
import ImageComponent from "~/components/components/ImageComponent";


interface Props {
    component: ComponentType;
}

export default function Component({component}: Props) {
    function renderComponent(component: ComponentType) {

        switch (component.__t) {
            case "TextComponent":
                const textComponent = component as TextComponentType;
                return <TextComponent textComponent={textComponent}/>

            case "ButtonComponent":
                const buttonComponent = component as ButtonComponentType;
                return <ButtonComponent buttonComponent={buttonComponent}/>

            case "ImageComponent":
                const imageComponent = component as ImageComponentType;
                return <ImageComponent imageComponent={imageComponent}/>
            default:
                return <div>Component not found</div>
        }
    }

    return renderComponent(component)
}