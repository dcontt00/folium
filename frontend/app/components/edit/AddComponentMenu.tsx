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
    portfolio_id: string;
    portfolioComponentsLength: number;
    onAddComponent: (component: ComponentType) => void;
    allowContainerComponent?: boolean,
    largeButton?: boolean,
    className?: string
}

export default function AddComponentMenu({
                                             onAddComponent,
                                             portfolio_id,
                                             portfolioComponentsLength,
                                             allowContainerComponent = true,
                                             largeButton = true,
                                             className = ""
                                         }: Props) {

    function onAddTextComponent() {
        const newComponent: TextComponentType = {
            _id: null,
            index: portfolioComponentsLength - 1,
            portfolio_id: portfolio_id,
            __t: "TextComponent",
            text: "Hello World",
            type: TextType.TEXT,
            style: TextStyle.NORMAL
        }
        onAddComponent(newComponent);
    }

    function onAddButtonComponent() {
        const newComponent: ButtonComponentType = {
            _id: null,
            index: portfolioComponentsLength - 1,
            portfolio_id: portfolio_id,
            __t: "ButtonComponent",
            text: "Button",
            url: "/",
            color: "blue",
        }
        onAddComponent(newComponent);
    }

    function onAddImageComponent() {
        const newComponent: ImageComponentType = {
            _id: null,
            index: portfolioComponentsLength - 1,
            portfolio_id: portfolio_id,
            __t: "ImageComponent",
            url: "https://via.placeholder.com/150",
        }
        onAddComponent(newComponent);
    }

    function onAddContainerComponent() {
        const newComponent: ContainerComponentType = {
            _id: null,
            index: portfolioComponentsLength - 1,
            portfolio_id: portfolio_id,
            __t: "ContainerComponent",
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