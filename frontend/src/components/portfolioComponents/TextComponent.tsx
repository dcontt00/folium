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
                        fontSize: "2.8em",
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
                        fontSize: "2.5em",
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
                        fontSize: "2.2em",
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
                        fontSize: "1.9em",
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
                        fontSize: "1.6em",
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
                        fontSize: "1.3em",
                        fontFamily: styleClass.textFont,
                        width: "100%",
                        textAlign: styleClass.textAlign,
                    }}
                >
                    {textComponent.text}
                </Title>
            )
        case TextType.P:
            return (
                <Text
                    // @ts-ignore
                    style={{
                        fontSize: "1em",
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