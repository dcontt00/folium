import {Accordion, ColorInput, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";
import {getContrastColor} from "~/utils";

interface Props {
    backgroundColor: string;
    fontFamily: string;
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}


export default function PortfolioStyle({backgroundColor, fontFamily, onStyleChange}: Props) {


    function handleBackgroundColorChange(color: string) {
        onStyleChange("root", "backgroundColor", color);
        const contrastedColor = getContrastColor(color)
        onStyleChange("root", "color", contrastedColor);
    }

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
                            onChange={(color) => handleBackgroundColorChange(color)}
                        />
                        <FontsComboBox fontFamily={fontFamily} onStyleChange={onStyleChange} identifier="root"/>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}