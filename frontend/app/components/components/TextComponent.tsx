import type {TextComponentType} from "../../../../common/interfaces/interfaces";


import {Text} from "@mantine/core";

interface TextComponentProps {
    textComponent: TextComponentType;
}

export default function TextComponent({textComponent}: TextComponentProps) {
    return (
            <Text>{textComponent.text}</Text>
    )
}