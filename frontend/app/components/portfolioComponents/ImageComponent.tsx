import type {ImageComponentType} from "~/interfaces/interfaces";

interface Props {
    imageComponent: ImageComponentType;
}

export default function ImageComponent({imageComponent}: Props) {
    return (
        <img style={{width: "100%"}} src={imageComponent.url} alt={imageComponent.url}/>
    )
}