import {Combobox, Text, TextInput, useCombobox} from "@mantine/core";
import {useState} from "react";
import {IconLetterCase} from "@tabler/icons-react";
import FieldLabel from "~/components/FieldLabel";


interface Props {
    fontFamily: string;
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
    identifier: string;
}

const fonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Impact',
    'Times New Roman',
]

export default function FontsCombobox({fontFamily, onStyleChange, identifier}: Props) {
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch('');
        },

        onDropdownOpen: () => {
            if (combobox.focusSearchInput && combobox.searchRef?.current) {
                combobox.focusSearchInput();
            }
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
                onStyleChange(identifier, "textFont", optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
        >
            <Combobox.Target>
                <TextInput
                    label={
                        <FieldLabel text={"Font"} icon={<IconLetterCase size={16}/>}/>
                    }
                    value={fontFamily}
                    onChange={(event) => {
                        onStyleChange(identifier, "textFont", event.currentTarget.value);
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