import {Accordion, ColorInput, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";

interface Props {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    fontFamily: string;
    setFontFamily: (fontFamily: string) => void;
}


export default function PortfolioStyle({backgroundColor, setBackgroundColor, fontFamily, setFontFamily}: Props) {


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
                            onChange={setBackgroundColor}
                        />
                        <FontsComboBox fontFamily={fontFamily} setFontFamily={setFontFamily}/>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}