import type {ButtonComponentType, ComponentType, TextComponentType} from "../../../../common/interfaces/interfaces";
import EditTextComponent from "~/components/editComponents/EditTextComponent";
import EditButtonComponent from "~/components/editComponents/EditButtonComponent";
import {Button} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";


interface Props {
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
    onRemoveComponent: (component: ComponentType) => void;

}

export default function EditComponentSection({component, onEditComponent, onRemoveComponent}: Props) {


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
        <>
            {renderComponent(component, onEditComponent)}
            <Button
                variant="danger"
                leftSection={<IconTrash/>}
                onClick={() => onRemoveComponent(component)}
            >
                Remove
            </Button>
        </>
    )


}