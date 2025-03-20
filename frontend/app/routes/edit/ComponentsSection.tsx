import TextComponent from "~/components/components/TextComponent";
import type {
    ButtonComponentType,
    ComponentType,
    Portfolio,
    TextComponentType
} from "../../../../common/interfaces/interfaces"
import ButtonComponent from "~/components/components/ButtonComponent";
import {Stack} from "@mantine/core";

interface Props {
    portfolio: Portfolio;
    onSelectEditComponent: (component: ComponentType) => void;
}

function renderComponent(component: any, onSelectEditComponent: (component: ComponentType) => void) {

    switch (component.__t) {
        case "TextComponent":
            const textComponent = component as TextComponentType;
            return <TextComponent textComponent={textComponent} onSelectEditComponent={onSelectEditComponent}
                                  selectable/>

        case "ButtonComponent":
            const buttonComponent = component as ButtonComponentType;
            return <ButtonComponent buttonComponent={buttonComponent} onSelectEditComponent={onSelectEditComponent}
                                    selectable/>
        default:
            return <div>Component not found</div>
    }
}

export default function ComponentsSection({portfolio, onSelectEditComponent}: Props) {
    return (
        <div>
            <Stack align="center">
                {portfolio.components.map((component, index) => (
                    <div key={index}>{renderComponent(component, onSelectEditComponent)}</div>
                ))}
            </Stack>
        </div>
    )
}