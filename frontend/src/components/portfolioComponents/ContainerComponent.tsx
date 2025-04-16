import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";

interface Props {
    containerComponent: ContainerComponentType,
}

export default function ContainerComponent({containerComponent}: Props) {

    return (
        <div
            style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
            {containerComponent.components.map((component: ComponentType, index: number) => (
                <div
                    className="containerComponent"
                >
                    <Component component={component}/>
                </div>
            ))}
        </div>
    )

}