import type {TextComponentType} from "../../../../common/interfaces/interfaces";
import {Textarea} from "@mantine/core";
import {useState} from "react";


interface Props {
    component: TextComponentType;
    onEditComponent: (component: TextComponentType) => void;
}

export default function EditTextComponent({component, onEditComponent}: Props) {
    const [value, setValue] = useState(component.text);

    function onChange(event: any) {
        setValue(event.target.value);
        // Change the text of the component
        component.text = event.target.value;
        onEditComponent(component);
    }

    return (
        <Textarea
            label="Text"
            value={value}
            onChange={(event) => onChange(event)}
        />
    )
}