import type {ButtonComponentType, ComponentType, TextComponentType} from "../../../../common/interfaces/interfaces";
import EditTextComponent from "~/routes/edit/EditTextComponent";
import EditButtonComponent from "~/routes/edit/EditButtonComponent";
import {Button, Stack} from "@mantine/core";


interface Props {
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
    onOk: () => void;
}

export default function EditComponentSection({component, onEditComponent, onOk}: Props) {


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
        <Stack p="sm">

            {renderComponent(component, onEditComponent)}
            <Button onClick={onOk}>Ok</Button>
        </Stack>
    )


}