import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";
import type StyleClass from "~/interfaces/styleClass";
import type Style from "~/interfaces/style";

interface Props {
    containerComponent: ContainerComponentType,
    styleClass: StyleClass
    style: Style
}

export default function ContainerComponent({containerComponent, styleClass, style}: Props) {

    return (
        <div
            style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
            {containerComponent.components.map((component: ComponentType, index: number) => (
                <div
                    className="containerComponent"
                    key={index}
                >
                    <Component component={component} styleClass={styleClass} style={style}/>
                </div>
            ))}
        </div>
    )

}