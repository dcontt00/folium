import type {ButtonComponentType, ComponentType, TextComponentType} from "../../../../common/interfaces/interfaces";
import TextComponent from "~/components/components/TextComponent";
import ButtonComponent from "~/components/components/ButtonComponent";


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
            default:
                return <div>Component not found</div>
        }
    }

    return renderComponent(component)
}