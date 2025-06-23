import type {TextComponentType} from "~/interfaces/interfaces";
import {Combobox, Input, InputBase, SegmentedControl, Stack, Text, Textarea, useCombobox} from "@mantine/core";
import {useEffect, useState} from "react";
import {TextType} from "~/interfaces/textComponent";
import type StyleClass from "~/interfaces/styleClass";
import FontsCombobox from "~/components/edit/portfolioStyle/FontsCombobox";
import {IconAlignCenter, IconAlignJustified, IconAlignLeft, IconAlignRight, IconBallpen} from "@tabler/icons-react";
import FieldLabel from "~/components/FieldLabel";

interface Props {
    component: TextComponentType;
    onEditComponent: (component: TextComponentType) => void;
    styleClass: StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

function rewriteTextType(type: string): string {
    switch (type) {
        case TextType.H1:
            return "Heading 1";
        case TextType.H2:
            return "Heading 2";
        case TextType.H3:
            return "Heading 3";
        case TextType.H4:
            return "Heading 4";
        case TextType.H5:
            return "Heading 5";
        case TextType.H6:
            return "Heading 6";
        case TextType.P:
            return "Paragraph";
        default:
            return type;
    }
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
        console.log(value)
        setTextType(value);
        combobox.closeDropdown();

        // Change the text type of the component
        component.type = value as TextType;
        onEditComponent(component);
    }

    function handleStyleChange(identifier: string, attribute: string, value: string) {
        onStyleChange(identifier, attribute, value);
        onEditComponent(component);
    }


    const textTypeOptions = Object.values(TextType).map((item) => (
        <Combobox.Option value={item} key={item}>
            {rewriteTextType(item)}
        </Combobox.Option>
    ));

    function handleTextAlignChange(value: string) {
        if (!value) {
            return
        }
        onStyleChange(component.className, "textAlign", value);
        onEditComponent(component);
    }

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
                        {rewriteTextType(textType || "") || <Input.Placeholder>Pick value</Input.Placeholder>}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{textTypeOptions}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <Textarea
                label={
                    <FieldLabel text={"Text"} icon={<IconBallpen size={16}/>}/>
                }
                value={text}
                autosize
                onChange={(event) => onTextChange(event)}
            />
            <FontsCombobox
                fontFamily={styleClass.textFont}
                onStyleChange={handleStyleChange}
                identifier={component.className}
            />
            <Stack gap={5}>
                <Text size={"sm"}>Text Align</Text>
                <SegmentedControl
                    value={styleClass.textAlign}
                    onChange={handleTextAlignChange}
                    data={[
                        {
                            label: (
                                <IconAlignLeft size={16}/>
                            ), value: 'left'
                        },
                        {
                            label: (
                                <IconAlignCenter size={16}/>
                            ),
                            value: 'center'
                        },
                        {
                            label: (
                                <IconAlignRight size={16}/>
                            ),
                            value: 'right'
                        },
                        {
                            label: (
                                <IconAlignJustified size={16}/>
                            ),
                            value: 'justify'
                        },
                    ]}
                />
            </Stack>
        </Stack>
    );
}