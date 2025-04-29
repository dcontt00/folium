import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";
import type StyleClass from "~/interfaces/styleClass";

interface Props {
    containerComponent: ContainerComponentType,
    styleClass: StyleClass
}

export default function ContainerComponent({containerComponent, styleClass}: Props) {

    return (
        <div
            style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
            {containerComponent.components.map((component: ComponentType, index: number) => (
                <div
                    className="containerComponent"
                    key={index}
                >
                    <Component component={component} styleClass={styleClass}/>
                </div>
            ))}
        </div>
    )

}