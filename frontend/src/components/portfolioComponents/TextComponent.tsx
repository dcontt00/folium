import type {TextComponentType} from "~/interfaces/interfaces";


import {Text, Title} from "@mantine/core";
import {TextType} from "~/interfaces/textComponent";

interface TextComponentProps {
    textComponent: TextComponentType;
    fontFamily: string;
}

export default function TextComponent({textComponent, fontFamily}: TextComponentProps) {
    console.log(fontFamily)

    switch (textComponent.type) {
        case TextType.H1:
            return <Title style={{fontSize: "40px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        case TextType.H2:
            return <Title style={{fontSize: "36px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        case TextType.H3:
            return <Title style={{fontSize: "34px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        case TextType.H4:
            return <Title style={{fontSize: "30px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        case TextType.H5:
            return <Title style={{fontSize: "28px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        case TextType.H6:
            return <Title style={{fontSize: "26px", fontFamily: fontFamily}}>{textComponent.text}</Title>
        default:
            return (
                <Text style={{fontFamily: fontFamily}}>{textComponent.text}</Text>
            )
    }

}