import {Accordion, Center, ColorInput, SegmentedControl, Stack, Text} from "@mantine/core";
import {IconAlignCenter, IconAlignLeft, IconAlignRight, IconBrush} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";
import {getContrastColor} from "~/utils";
import type Style from "~/interfaces/style";

interface Props {
    style: Style
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}


export default function PortfolioStyle({style, onStyleChange}: Props) {


    function handleBackgroundColorChange(color: string) {
        onStyleChange("root", "backgroundColor", color);
        const contrastedColor = getContrastColor(color)
        onStyleChange("root", "color", contrastedColor);
    }

    function handleAlignItemsChange(value: string) {
        if (!value) {
            return
        }
        onStyleChange("container", "alignItems", value);
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
                            value={style.classes?.["root"].backgroundColor}
                            onChange={(color) => handleBackgroundColorChange(color)}
                        />
                        <FontsComboBox
                            fontFamily={style.classes?.["root"].textFont}
                            onStyleChange={onStyleChange}
                            identifier="root"
                        />
                        <Stack gap={"xs"}>
                            <Text>Components Alignment</Text>
                            <SegmentedControl
                                value={style.classes["container"].alignItems}
                                onChange={handleAlignItemsChange}
                                data={[
                                    {
                                        label: (
                                            <Center style={{gap: 10}}>
                                                <IconAlignLeft size={16}/>
                                                <span>Left</span>
                                            </Center>
                                        ), value: 'flex-start'
                                    },
                                    {
                                        label: (
                                            <Center style={{gap: 10}}>
                                                <IconAlignCenter size={16}/>
                                                <span>Center</span>
                                            </Center>
                                        ),
                                        value: 'center'
                                    },
                                    {
                                        label: (
                                            <Center style={{gap: 10}}>
                                                <IconAlignRight size={16}/>
                                                <span>Right</span>
                                            </Center>
                                        ),
                                        value: 'flex-end'
                                    },
                                ]}
                            />
                        </Stack>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
