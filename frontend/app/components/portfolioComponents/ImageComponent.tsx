import type {ImageComponentType} from "../../../../common/interfaces/interfaces";
import {Image} from "@mantine/core";

interface Props {
    imageComponent: ImageComponentType;
}

export default function ImageComponent({imageComponent}: Props) {
    return (
        <Image src={imageComponent.url} fallbackSrc="https://placehold.co/600x400?text=Placeholder"/>
    )
}