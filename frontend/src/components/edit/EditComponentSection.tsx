import type {ButtonComponentType, ComponentType, ImageComponentType, TextComponentType} from "~/interfaces/interfaces";
import EditTextComponent from "~/components/edit/editComponents/EditTextComponent";
import EditButtonComponent from "~/components/edit/editComponents/EditButtonComponent";
import EditImageComponent from "~/components/edit/editComponents/EditImageComponent";
import type StyleClass from "~/interfaces/styleClass";


interface Props {
    portfolioUrl: string;
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
    styleClass: StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditComponentSection({
                                                 component,
                                                 onEditComponent,
                                                 styleClass,
                                                 onStyleChange,
                                                 portfolioUrl
                                             }: Props) {
    function renderComponent(component: ComponentType, onEditComponent: (component: ComponentType) => void) {
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
                    onStyleChange={onStyleChange}
                />
            default:
                return <div>Component not found</div>
        }
    }


    return (
        renderComponent(component, onEditComponent)

    )


}