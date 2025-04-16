import type {ComponentType} from "~/interfaces/interfaces";
import Component from "~/components/portfolioComponents/Component";

interface Props {
    components: ComponentType[];
}

export default function ComponentsSection({components}: Props) {
    return (
        <div
            className="container"
        >
            {
                components.map((component: ComponentType, index: number) => (
                    <div
                        key={index}
                    >
                        <Component component={component}/>
                    </div>
                ))
            }
        </div>
    )
}