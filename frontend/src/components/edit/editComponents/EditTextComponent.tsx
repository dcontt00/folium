import type {TextComponentType} from "~/interfaces/interfaces";
import {Combobox, Input, InputBase, Stack, Textarea, useCombobox} from "@mantine/core";
import {useEffect, useState} from "react";
import {TextType} from "~/interfaces/textComponent";
import {capitalize} from "~/utils";
import type StyleClass from "~/interfaces/styleClass";
import FontsCombobox from "~/components/edit/portfolioStyle/FontsCombobox";

interface Props {
    component: TextComponentType;
    onEditComponent: (component: TextComponentType) => void;
    styleClass: StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditTextComponent({component, onEditComponent, styleClass, onStyleChange}: Props) {
    const [text, setText] = useState(component.text);
    const [textType, setTextType] = useState<string | null>(component.type);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // Needed when selecting a different component
    useEffect(() => {
        setText(component.text);
        setTextType(component.type);
    }, [component]);

    function onTextChange(event: any) {
        setText(event.target.value);

        // Change the text of the component
        component.text = event.target.value;
        onEditComponent(component);
    }

    function onTextTypeChange(value: string) {
        setTextType(value);
        combobox.closeDropdown();

        // Change the text type of the component
        component.type = value as TextType;
        onEditComponent(component);
    }

    function handleStyleChange(identifier: string, attribute: string, value: string) {
        console.log("handleStyleChange", component.className, attribute, value);
        onStyleChange(identifier, attribute, value);
        onEditComponent(component);
    }


    const textTypeOptions = Object.values(TextType).map((item) => (
        <Combobox.Option value={item} key={item}>
            {capitalize(item)}
        </Combobox.Option>
    ));

    return (
        <Stack>
            <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => onTextTypeChange(val)}
            >
                <Combobox.Target>
                    <InputBase
                        label="Text Type"
                        component="button"
                        type="button"
                        pointer
                        rightSection={<Combobox.Chevron/>}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                    >
                        {capitalize(textType) || <Input.Placeholder>Pick value</Input.Placeholder>}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{textTypeOptions}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <Textarea
                label="Text"
                value={text}
                onChange={(event) => onTextChange(event)}
            />
            <FontsCombobox
                fontFamily={styleClass.textFont}
                onStyleChange={handleStyleChange}
                identifier={component.className}
            />
        </Stack>
    );
}