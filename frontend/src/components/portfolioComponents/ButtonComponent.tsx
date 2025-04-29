import {Button} from "@mantine/core";
import type {ButtonComponentType} from "~/interfaces/interfaces";
import type StyleClass from "~/interfaces/styleClass";

interface TextComponentProps {
    buttonComponent: ButtonComponentType;
    styleClass:StyleClass
}

export default function ButtonComponent({buttonComponent,styleClass}: TextComponentProps) {

    return (
        <Button
            style={{backgroundColor: styleClass.buttonColor}}
        >
            {buttonComponent.text}
        </Button>
    )
}