import TextComponent from "~/components/TextComponent";
import type {ButtonComponentType, Portfolio, TextComponentType} from "../../../../common/interfaces/interfaces"

interface Props {
    portfolio: Portfolio;
    setPortfolio: (portfolio: Portfolio) => void;
}

function renderComponent(component: any) {
    switch (component.__t) {
        case "TextComponent":
            const textComponent = component as TextComponentType;
            return <TextComponent text={textComponent.text} edit={true}/>

        case "ButtonComponent":
            const buttonComponent = component as ButtonComponentType;
            return <div>Button: {buttonComponent.text}</div>
        default:
            return <div>Component not found</div>
    }
}

export default function EditComponentsSection({portfolio, setPortfolio}: Props) {
    return (
        <div>
            {portfolio.components.map((component, index) => (
                <div key={index}>{renderComponent(component)}</div>
            ))}
        </div>
    )
}