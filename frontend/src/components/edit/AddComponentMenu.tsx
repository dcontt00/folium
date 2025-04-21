import {ActionIcon, Button, Menu} from "@mantine/core";
import {IconContainer, IconHandClick, IconPhoto, IconPlus, IconTextCaption} from "@tabler/icons-react";
import type {
    ButtonComponentType,
    ComponentType,
    ContainerComponentType,
    ImageComponentType,
    TextComponentType
} from "~/interfaces/interfaces";
import {TextStyle, TextType} from "~/interfaces/textComponent";


interface Props {
    parent_id: string;
    portfolioComponentsLength: number;
    onAddComponent: (component: ComponentType) => void;
    allowContainerComponent?: boolean,
    largeButton?: boolean,
    className?: string
}

export default function AddComponentMenu({
                                             onAddComponent,
                                             parent_id,
                                             portfolioComponentsLength,
                                             allowContainerComponent = true,
                                             largeButton = true,
                                             className = ""
                                         }: Props) {

    function onAddTextComponent() {
        const newComponent: TextComponentType = {
            _id: null,
            __t: "TextComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            text: "Hello World",
            type: TextType.P,
            style: TextStyle.NORMAL
        }
        onAddComponent(newComponent);
    }

    function onAddButtonComponent() {
        const newComponent: ButtonComponentType = {
            _id: null,
            __t: "ButtonComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            text: "Button",
            url: "/",
            color: "blue",
        }
        onAddComponent(newComponent);
    }

    function onAddImageComponent() {
        const newComponent: ImageComponentType = {
            _id: null,
            __t: "ImageComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            url: "/placeholder.jpg",
            overlayText: null,
            caption: null,
            overlayTransparency: 0,
            width: 1
        }
        onAddComponent(newComponent);
    }

    function onAddContainerComponent() {
        const newComponent: ContainerComponentType = {
            _id: null,
            __t: "ContainerComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            components: [],
        }
        onAddComponent(newComponent);
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                {largeButton ?
                    <Button className={className} leftSection={<IconPlus/>}>Add Component</Button>
                    : <ActionIcon className={className}>
                        <IconPlus/>
                    </ActionIcon>
                }
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
                {
                    allowContainerComponent &&
                    <Menu.Item onClick={onAddContainerComponent} leftSection={<IconContainer/>}>
                        Container
                    </Menu.Item>
                }
            </Menu.Dropdown>
        </Menu>

    )
}