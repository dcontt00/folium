import TextComponent from "~/components/TextComponent";
import type {
    ButtonComponentType,
    ComponentType,
    Portfolio,
    TextComponentType
} from "../../../../common/interfaces/interfaces"
import ButtonComponent from "~/components/ButtonComponent";
import {Stack} from "@mantine/core";

interface Props {
    portfolio: Portfolio;
    setPortfolio: (portfolio: Portfolio) => void;
    editComponent: ComponentType | undefined,
    setEditComponent: (component: ComponentType | undefined) => void;
}

function renderComponent(component: any, setEditComponent: (component: ComponentType) => void) {

    switch (component.__t) {
        case "TextComponent":
            const textComponent = component as TextComponentType;
            return <TextComponent textComponent={textComponent} edit={false} setEditComponent={setEditComponent}/>

        case "ButtonComponent":
            const buttonComponent = component as ButtonComponentType;
            return <ButtonComponent {...buttonComponent} edit={false}/>
        default:
            return <div>Component not found</div>
    }
}

export default function ComponentsSection({portfolio, setPortfolio, editComponent, setEditComponent}: Props) {
    return (
        <div>
            <Stack align="center">
                {portfolio.components.map((component, index) => (
                    <div key={index}>{renderComponent(component, setEditComponent)}</div>
                ))}
            </Stack>
        </div>
    )
}