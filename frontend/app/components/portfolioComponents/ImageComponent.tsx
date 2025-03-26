import type {ImageComponentType} from "../../../../common/interfaces/interfaces";

interface Props {
    imageComponent: ImageComponentType;
}

export default function ImageComponent({imageComponent}: Props) {
    return (
        <img src={imageComponent.url} alt={imageComponent.url}/>
    )
}