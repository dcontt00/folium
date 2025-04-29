import type {ComponentType} from "~/interfaces/interfaces";
import Component from "~/components/portfolioComponents/Component";
import type Portfolio from "~/interfaces/portfolio";

interface Props {
    portfolioState:Portfolio
}

export default function ComponentsSection({portfolioState}: Props) {
    console.log("ComponentsSection", portfolioState)
    return (
        <div
            className="container"
        >
            {
                portfolioState.components.map((component: ComponentType, index: number) => (
                    <div
                        key={index}
                    >
                        <Component styleClass={portfolioState.style.classes?.[component.className]} component={component}/>
                    </div>
                ))
            }
        </div>
    )
}