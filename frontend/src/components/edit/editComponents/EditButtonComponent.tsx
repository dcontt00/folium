import type {ButtonComponentType} from "~/interfaces/interfaces";
import {ColorInput, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import type StyleClass from "~/interfaces/styleClass";
import {getContrastColor} from "~/utils";


interface Props {
    component: ButtonComponentType;
    onEditComponent: (component: ButtonComponentType) => void;
    styleClass: StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditButtonComponent({component, onEditComponent, styleClass, onStyleChange}: Props) {
    const [text, setText] = useState(component.text);
    const [url, setUrl] = useState(component.url);
    const [urlError, setUrlError] = useState<string | null>(null);


    useEffect(() => {
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
        const newUrl = event.target.value;
        setUrl(newUrl);

        // Validate URL
        const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
        if (!urlPattern.test(newUrl)) {
            setUrlError("Invalid URL format");
        } else {
            setUrlError(null);
            component.url = newUrl;
            onEditComponent(component);
        }
    }

    function onColorChange(value: string) {
        // Change the text of the component
        onStyleChange(component.className, "backgroundColor", value);
        const contrastedTextColor = getContrastColor(value);
        console.log("onColorChange", contrastedTextColor)
        onStyleChange(component.className, "color", contrastedTextColor);
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
                error={urlError}
            />
            <ColorInput
                label="Button color"
                value={styleClass.backgroundColor}
                onChange={(event) => onColorChange(event)}
            />
        </Stack>
    )
}