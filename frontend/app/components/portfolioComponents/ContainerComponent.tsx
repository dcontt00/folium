import type {ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";


interface Props {
    containerComponent: ContainerComponentType
}

export default function ContainerComponent({containerComponent}: Props) {


    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            {containerComponent.components.map((component, index) => (
                <Component key={index} component={component}/>
            ))}
        </div>
    )
}