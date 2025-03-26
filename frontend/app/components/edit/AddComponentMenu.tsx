import {Button, Menu} from "@mantine/core";
import {IconHandClick, IconPhoto, IconTextCaption} from "@tabler/icons-react";
import type {
    ButtonComponentType,
    ComponentType,
    ImageComponentType,
    Portfolio,
    TextComponentType
} from "~/interfaces/interfaces";
import {TextStyle, TextType} from "~/interfaces/textComponent";


interface Props {
    portfolio: Portfolio;
    onAddComponent: (component: ComponentType) => void;
}

export default function AddComponentMenu({portfolio, onAddComponent}: Props) {

    function onAddTextComponent() {
        const newComponent: TextComponentType = {
            _id: Date.now().toString(),
            index: portfolio.components.length - 1,
            portfolio_id: portfolio._id,
            __t: "TextComponent",
            text: "Hello World",
            type: TextType.TEXT,
            style: TextStyle.NORMAL
        }
        onAddComponent(newComponent);
    }

    function onAddButtonComponent() {
        const newComponent: ButtonComponentType = {
            _id: Date.now().toString(),
            index: portfolio.components.length - 1,
            portfolio_id: portfolio._id,
            __t: "ButtonComponent",
            text: "Button",
            url: "/",
            color: "blue",
        }
        onAddComponent(newComponent);
    }

    function onAddImageComponent() {
        const newComponent: ImageComponentType = {
            _id: Date.now().toString(),
            index: portfolio.components.length - 1,
            portfolio_id: portfolio._id,
            __t: "ImageComponent",
            url: "https://via.placeholder.com/150",
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
                <Menu.Item onClick={onAddImageComponent} leftSection={<IconPhoto/>}>
                    Image
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>

    )
}