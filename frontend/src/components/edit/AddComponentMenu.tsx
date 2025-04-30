import {Button, Menu} from "@mantine/core";
import {IconContainer, IconHandClick, IconPhoto, IconPlus, IconTextCaption} from "@tabler/icons-react";
import type {
    ButtonComponentType,
    ComponentType,
    ContainerComponentType,
    ImageComponentType,
    TextComponentType
} from "~/interfaces/interfaces";
import {TextStyle, TextType} from "~/interfaces/textComponent";
import {generateRandomClassName} from "~/utils";
import type StyleClass from "~/interfaces/styleClass";


interface Props {
    parent_id: string;
    portfolioComponentsLength: number;
    onAddComponent: (component: ComponentType) => void;
    allowContainerComponent?: boolean,
    onStyleClassAdd: (styleClass: StyleClass) => void
}

export default function AddComponentMenu({
                                             onAddComponent,
                                             parent_id,
                                             portfolioComponentsLength,
                                             allowContainerComponent = true,
                                             onStyleClassAdd,
                                         }: Props) {

    function onAddTextComponent() {
        const className = generateRandomClassName();
        const styleClass: StyleClass = {
            identifier: className,
            color: "#000000",
        }
        const newComponent: TextComponentType = {
            _id: null,
            __t: "TextComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            text: "Hello World",
            type: TextType.P,
            style: TextStyle.NORMAL,
            className: className
        }
        onStyleClassAdd(styleClass)
        onAddComponent(newComponent);
    }

    function onAddButtonComponent() {
        const className = generateRandomClassName();
        const styleClass: StyleClass = {
            identifier: className,
            backgroundColor: "#0070f3",
            border: "none",
            fontSize: "1rem",
            padding: "15px 32px",
            transition: "transform 0.2s ease",
            cursor: "pointer",
            borderRadius: "5px",
        }

        const animationStyleClass: StyleClass = {
            identifier: className + ":active",
            transform: "scale(0.95)"
        }
        const newComponent: ButtonComponentType = {
            _id: null,
            __t: "ButtonComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            text: "Button",
            url: "/",
            className: className
        }
        onStyleClassAdd(styleClass)
        onStyleClassAdd(animationStyleClass)
        onAddComponent(newComponent);
    }

    function onAddImageComponent() {
        const className = generateRandomClassName();
        const styleClass: StyleClass = {
            identifier: className,
            imageWidth: "100",
        }

        const imageContainerClass: StyleClass = {
            identifier: className + "-container",
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2d3748",
        }

        const overlayTextClass: StyleClass = {
            identifier: className + "-overlay",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }

        const imageCaptionClass: StyleClass = {
            identifier: className + "-caption",
            marginTop: "0.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#ffffff"
        }

        const newComponent: ImageComponentType = {
            _id: null,
            __t: "ImageComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            url: "/placeholder.jpg",
            overlayText: null,
            caption: null,
            className: className
        }
        onStyleClassAdd(styleClass)
        onStyleClassAdd(imageContainerClass)
        onStyleClassAdd(overlayTextClass)
        onStyleClassAdd(imageCaptionClass)
        onAddComponent(newComponent);
    }

    function onAddContainerComponent() {
        const className = generateRandomClassName();
        const styleClass: StyleClass = {
            identifier: className,
            backgroundColor: "#ffffff",
            color: "#000000",
        }
        const newComponent: ContainerComponentType = {
            _id: null,
            __t: "ContainerComponent",
            componentId: Math.floor(Math.random() * 1000000),
            index: portfolioComponentsLength - 1,
            parent_id: parent_id,
            components: [],
            className: className

        }
        onStyleClassAdd(styleClass)
        onAddComponent(newComponent);
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant="outline" leftSection={<IconPlus/>}>Add Component</Button>
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