import type {TextComponentType} from "~/interfaces/interfaces";


import {Text, Title} from "@mantine/core";
import {TextType} from "~/interfaces/textComponent";

interface TextComponentProps {
    textComponent: TextComponentType;
}

export default function TextComponent({textComponent}: TextComponentProps) {

    switch (textComponent.type) {
        case TextType.H1:
            return <Title style={{fontSize: "40px"}}>{textComponent.text}</Title>
        case TextType.H2:
            return <Title style={{fontSize: "36px"}}>{textComponent.text}</Title>
        case TextType.H3:
            return <Title style={{fontSize: "34px"}}>{textComponent.text}</Title>
        case TextType.H4:
            return <Title style={{fontSize: "30px"}}>{textComponent.text}</Title>
        case TextType.H5:
            return <Title style={{fontSize: "28px"}}>{textComponent.text}</Title>
        case TextType.H6:
            return <Title style={{fontSize: "26px"}}>{textComponent.text}</Title>
        default:
            return (
                <Text>{textComponent.text}</Text>
            )
    }

}