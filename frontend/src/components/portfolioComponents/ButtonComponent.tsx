import {Button} from "@mantine/core";
import type {ButtonComponentType} from "~/interfaces/interfaces";

interface TextComponentProps {
    buttonComponent: ButtonComponentType;
}

export default function ButtonComponent({buttonComponent}: TextComponentProps) {

    return (
        <Button
            style={{backgroundColor: buttonComponent.color}}
            onClick={() => window.location.href = buttonComponent.url}
        >
            {buttonComponent.text}
        </Button>
    )
}