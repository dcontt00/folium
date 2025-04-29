import type {ButtonComponentType} from "~/interfaces/interfaces";
import {ColorInput, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import type StyleClass from "~/interfaces/styleClass";


interface Props {
    component: ButtonComponentType;
    onEditComponent: (component: ButtonComponentType) => void;
    styleClass:StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditButtonComponent({component, onEditComponent, styleClass,onStyleChange}: Props) {
    const [text, setText] = useState(component.text);
    const [url, setUrl] = useState(component.url);
    const [color, setColor] = useState(styleClass.buttonColor || "#0070f3");

    useEffect(() => {
        setColor(styleClass.buttonColor);
        setText(component.text);
        setUrl(component.url);
    }, [component]);

    function onTextChange(event: any) {
        setText(event.target.value);
        // Change the text of the component
        component.text = event.target.value;
        onEditComponent(component);
    }

    function onUrlChange(event: any) {
        setUrl(event.target.value);
        // Change the text of the component
        component.url = event.target.value;
        onEditComponent(component);
    }

    function onColorChange(value: string) {
        setColor(value);
        // Change the text of the component
        onStyleChange(component.className, "buttonColor", value);
        onEditComponent(component);
    }


    return (
        <Stack>
            <TextInput
                label="Text"
                value={text}
                onChange={(event) => onTextChange(event)}
            />
            <TextInput
                label="Url"
                value={url}
                onChange={(event) => onUrlChange(event)}
            />
            <ColorInput
                label="Button color"
                value={color}
                onChange={(event) => onColorChange(event)}
            />
        </Stack>
    )
}