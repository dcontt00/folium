import {Accordion, ColorInput, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";

interface Props {
    backgroundColor: string;
    fontFamily: string;
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}


export default function PortfolioStyle({backgroundColor, fontFamily, onStyleChange}: Props) {


    return (
        <Accordion styles={{
            content: {
                padding: 0
            }
        }}>
            <Accordion.Item key="General" value="General">
                <Accordion.Control icon={<IconBrush/>}>Portfolio Style</Accordion.Control>
                <Accordion.Panel>
                    <Stack>
                        <ColorInput
                            label="Background color"
                            value={backgroundColor}
                            onChange={(color) => onStyleChange("root", "backgroundColor", color)}
                        />
                        <FontsComboBox fontFamily={fontFamily} onStyleChange={onStyleChange} identifier="root"/>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}