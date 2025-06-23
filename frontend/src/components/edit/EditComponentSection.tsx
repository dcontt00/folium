import type {ButtonComponentType, ComponentType, ImageComponentType, TextComponentType} from "~/interfaces/interfaces";
import EditTextComponent from "~/components/edit/editComponents/EditTextComponent";
import EditButtonComponent from "~/components/edit/editComponents/EditButtonComponent";
import EditImageComponent from "~/components/edit/editComponents/EditImageComponent";
import type StyleClass from "~/interfaces/styleClass";
import type Style from "~/interfaces/style";
import {IconInfoCircle} from "@tabler/icons-react";
import {Alert} from "@mantine/core";


interface Props {
    portfolioUrl: string;
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
    styleClass: StyleClass,
    style: Style,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditComponentSection({
                                                 component,
                                                 onEditComponent,
                                                 styleClass,
                                                 onStyleChange,
                                                 portfolioUrl,
                                                 style
                                             }: Props) {
    function renderComponent(component: ComponentType, onEditComponent: (component: ComponentType) => void) {
        console.log("EditComponentSection", component, styleClass)

        switch (component.__t) {
            case "TextComponent":
                const textComponent = component as TextComponentType;
                return <EditTextComponent
                    component={textComponent}
                    onEditComponent={onEditComponent}
                    styleClass={styleClass}
                    onStyleChange={onStyleChange}
                />

            case "ButtonComponent":
                const buttonComponent = component as ButtonComponentType;
                return <EditButtonComponent
                    component={buttonComponent}
                    onEditComponent={onEditComponent}
                    styleClass={styleClass}
                    onStyleChange={onStyleChange}
                />
            case "ImageComponent":
                const imageComponent = component as ImageComponentType;
                return <EditImageComponent
                    portfolioUrl={portfolioUrl}
                    component={imageComponent}
                    onEditComponent={onEditComponent}
                    styleClass={styleClass}
                    style={style}
                    onStyleChange={onStyleChange}
                />
            default:
                return <div>
                    <Alert
                        variant="light"
                        color="blue"
                        title="Select a component to edit it"
                        icon={<IconInfoCircle/>}
                    />
                </div>
        }
    }


    return (
        renderComponent(component, onEditComponent)

    )


}