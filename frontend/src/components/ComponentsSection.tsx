import type {ComponentType} from "~/interfaces/interfaces";
import Component from "~/components/portfolioComponents/Component";

interface Props {
    components: ComponentType[];
    fontFamily: string;
}

export default function ComponentsSection({components, fontFamily}: Props) {
    return (
        <div
            className="container"
        >
            {
                components.map((component: ComponentType, index: number) => (
                    <div
                        key={index}
                    >
                        <Component fontFamily={fontFamily} component={component}/>
                    </div>
                ))
            }
        </div>
    )
}