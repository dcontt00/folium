import {Button} from "@mantine/core";
import type {ButtonComponentType} from "../../../../common/interfaces/interfaces";

interface TextComponentProps {
    buttonComponent: ButtonComponentType;
}

export default function ButtonComponent({buttonComponent}: TextComponentProps) {

    return (
        <Button
            color={buttonComponent.color}
            onClick={() => window.location.href = buttonComponent.url}
        >
            {buttonComponent.text}
        </Button>
    )
}