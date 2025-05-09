import type {TextComponentType} from "~/interfaces/interfaces";
import {Text, Title} from "@mantine/core";
import {TextType} from "~/interfaces/textComponent";
import type StyleClass from "~/interfaces/styleClass";

interface TextComponentProps {
    textComponent: TextComponentType;
    styleClass: StyleClass
}

export default function TextComponent({textComponent, styleClass}: TextComponentProps) {

    switch (textComponent.type) {
        case TextType.H1:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "40px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.H2:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "36px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.H3:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "34px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.H4:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "30px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.H5:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "28px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.H6:
            return (
                <Title
                    // @ts-ignore
                    style={{
                        fontSize: "26px",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        default:
            return (
                <Text
                    // @ts-ignore
                    style={{
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign
                    }}
                >
                    {textComponent.text}
                </Text>
            )
    }

}