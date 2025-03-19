import type {ButtonComponentType, ComponentType, TextComponentType} from "../../../../common/interfaces/interfaces";
import EditTextComponent from "~/routes/edit/EditTextComponent";
import EditButtonComponent from "~/routes/edit/EditButtonComponent";


interface Props {
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
}

export default function EditComponentSection({component, onEditComponent}: Props) {


    function renderComponent(component: ComponentType, onEditComponent: (component: ComponentType) => void) {
        switch (component.__t) {
            case "TextComponent":
                const textComponent = component as TextComponentType;
                return <EditTextComponent component={textComponent} onEditComponent={onEditComponent}/>

            case "ButtonComponent":
                const buttonComponent = component as ButtonComponentType;
                return <EditButtonComponent component={buttonComponent} onEditComponent={onEditComponent}/>
            default:
                return <div>Component not found</div>
        }
    }


    return (
        renderComponent(component, onEditComponent)
    )


}