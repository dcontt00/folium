import type {ImageComponentType} from "../../../../../common/interfaces/interfaces";
import {Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

interface Props {
    component: ImageComponentType;
    onEditComponent: (component: ImageComponentType) => void;
}

export default function EditTextComponent({component, onEditComponent}: Props) {
    const [url, setUrl] = useState(component.url);


    // Needed when selecting a different component
    useEffect(() => {
        setUrl(component.url);
    }, [component]);

    function onUrlChange(event: any) {
        setUrl(event.target.value);

        // Change the text of the component
        component.url = event.target.value;
        onEditComponent(component);
    }


    return (
        <Stack>
            <TextInput
                label="Url"
                value={url}
                onChange={(event) => onUrlChange(event)}
            />
        </Stack>
    );
}