import type {ButtonComponentType} from "../../../../common/interfaces/interfaces";
import {ColorInput, Stack, TextInput} from "@mantine/core";
import {useState} from "react";


interface Props {
    component: ButtonComponentType;
    onEditComponent: (component: ButtonComponentType) => void;
}

export default function EditButtonComponent({component, onEditComponent}: Props) {
    const [text, setText] = useState(component.text);
    const [url, setUrl] = useState(component.url);
    const [color, setColor] = useState(component.color);

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
        component.color = value;
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