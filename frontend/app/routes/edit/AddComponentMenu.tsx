import {Button, Menu} from "@mantine/core";
import {IconHandClick, IconTextCaption} from "@tabler/icons-react";
import type {
    ButtonComponentType,
    ComponentType,
    Portfolio,
    TextComponentType
} from "../../../../common/interfaces/interfaces";


interface Props {
    portfolio: Portfolio;
    onAddComponent: (component: ComponentType) => void;
}

export default function AddComponentMenu({portfolio, onAddComponent}: Props) {

    function onAddTextComponent() {
        const newComponent: TextComponentType = {
            _id: "",
            index: portfolio.components.length - 1,
            portfolio_id: portfolio._id,
            __t: "TextComponent",
            text: "Hello World"
        }
        onAddComponent(newComponent);
    }

    function onAddButtonComponent() {
        const newComponent: ButtonComponentType = {
            _id: "",
            index: portfolio.components.length - 1,
            portfolio_id: portfolio._id,
            __t: "ButtonComponent",
            text: "Button",
            url: "/",
            color: "blue",
        }
        onAddComponent(newComponent);
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button>Add Component</Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={onAddTextComponent} leftSection={<IconTextCaption/>}>
                    Text
                </Menu.Item>
                <Menu.Item onClick={onAddButtonComponent} leftSection={<IconHandClick/>}>
                    Button
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>

    )
}