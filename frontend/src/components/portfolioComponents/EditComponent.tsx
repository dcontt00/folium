import type {
    ButtonComponentType,
    ComponentType,
    ContainerComponentType,
    ImageComponentType,
    TextComponentType
} from "~/interfaces/interfaces";
import TextComponent from "~/components/portfolioComponents/TextComponent";
import ButtonComponent from "~/components/portfolioComponents/ButtonComponent";
import ImageComponent from "~/components/portfolioComponents/ImageComponent";
import EditContainerComponent from "~/components/edit/editComponents/EditContainerComponent";
import type StyleClass from "~/interfaces/styleClass";
import type Style from "~/interfaces/style";


interface Props {
    component: ComponentType;
    onEditComponent: (component: ComponentType) => void;
    onSelectEditComponent: (component: ComponentType) => void;
    styleClass: StyleClass,
    onStyleClassAdd: (styleClass: StyleClass) => void,
    style: Style
}

export default function EditComponent({
                                          component,
                                          onEditComponent,
                                          onSelectEditComponent,
                                          styleClass,
                                          onStyleClassAdd,
                                          style
                                      }: Props) {
    function renderComponent(component: ComponentType) {

        switch (component.__t) {
            case "TextComponent":
                const textComponent = component as TextComponentType;
                return <TextComponent textComponent={textComponent} styleClass={styleClass}/>

            case "ButtonComponent":
                const buttonComponent = component as ButtonComponentType;
                return <ButtonComponent buttonComponent={buttonComponent} styleClass={styleClass}/>

            case "ImageComponent":
                const imageComponent = component as ImageComponentType;
                return <ImageComponent imageComponent={imageComponent} styleClass={styleClass}/>

            case "ContainerComponent":
                const containerComponent = component as ContainerComponentType;
                return <EditContainerComponent
                    onSelectEditComponent={onSelectEditComponent}
                    onEditComponent={onEditComponent}
                    containerComponent={containerComponent}
                    onStyleClassAdd={onStyleClassAdd}
                    style={style}
                />
            default:
                console.log(component.__t)
                return <div>Component not found</div>
        }
    }

    return renderComponent(component)
}