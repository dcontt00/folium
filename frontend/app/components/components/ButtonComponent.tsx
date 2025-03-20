import {Button} from "@mantine/core";
import type {ButtonComponentType} from "../../../../common/interfaces/interfaces";
import BaseComponent from "~/components/components/BaseComponent";

interface TextComponentProps {
    buttonComponent: ButtonComponentType;
    onSelectEditComponent: (component: ButtonComponentType) => void;
    selectable?: boolean;
}

export default function ButtonComponent({
                                            buttonComponent,
                                            onSelectEditComponent,
                                            selectable = false
                                        }: TextComponentProps) {

    return (
        <BaseComponent component={buttonComponent} onSelectEditComponent={onSelectEditComponent}
                       selectable={selectable}>
            <Button
                color={buttonComponent.color}
                onClick={() => window.location.href = buttonComponent.url}
            >
                {buttonComponent.text}
            </Button>
        </BaseComponent>
    )
}