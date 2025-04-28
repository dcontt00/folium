import {Combobox, Text, TextInput, useCombobox} from "@mantine/core";
import {useState} from "react";


interface Props {
    fontFamily: string;
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

const fonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Impact',
    'Tahoma',
    'Times New Roman',
    'Verdana'
]

export default function FontsCombobox({fontFamily, onStyleChange}: Props) {
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch('');
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput();
        },
    });

    const options = fonts
        .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
        .map((item) => (
            <Combobox.Option value={item} key={item}>
                <Text style={{fontFamily: item}}>{item}</Text>
            </Combobox.Option>
        ));

    return (

        <Combobox
            onOptionSubmit={(optionValue) => {
                onStyleChange("root", "textFont", optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
        >
            <Combobox.Target>
                <TextInput
                    label="Pick value or type anything"
                    placeholder="Pick value or type anything"
                    value={fontFamily}
                    onChange={(event) => {
                        onStyleChange("root", "textFont", event.currentTarget.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}