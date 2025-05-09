import {Accordion, ColorInput, SegmentedControl, Slider, Stack, Text} from "@mantine/core";
import {
    IconAlignCenter,
    IconAlignLeft,
    IconAlignRight,
    IconBrush,
    IconSeparatorHorizontal,
    IconSeparatorVertical
} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";
import {getContrastColor} from "~/utils";
import type Style from "~/interfaces/style";
import {useEffect, useState} from "react";
import FieldLabel from "~/components/FieldLabel";

interface Props {
    style: Style
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}


export default function PortfolioStyle({style, onStyleChange}: Props) {

    const [horizontalPadding, setHorizontalPadding] = useState(1);
    const [verticalPadding, setVerticalPadding] = useState(0);

    useEffect(() => {

        if (!style) {
            return
        }

        const rootHorizontalPadding = style.classes["root"].padding.split(" ")[1] || "100%";
        const rootVerticalPadding = style.classes["root"].padding.split(" ")[0] || "0";
        setHorizontalPadding(Number(rootHorizontalPadding.replace("%", "")) / 100);
        setVerticalPadding(Number(rootVerticalPadding.replace("%", "")) / 100);
    }, [style.classes["root"]]);


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

    function onHorizontalPaddingChange(value: number) {
        setHorizontalPadding(value);

        onStyleChange("root", 'padding', `${verticalPadding * 100}% ${value * 100}%`);
    }

    function onVerticalPaddingChange(value: number) {
        setVerticalPadding(value);
        onStyleChange("root", 'padding', `${value * 100}% ${horizontalPadding * 100}%`);
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

                        <Stack gap={5}>
                            <FieldLabel text={"Horizontal Separation"} icon={<IconSeparatorVertical size={16}/>}/>
                            <Slider
                                color="blue"
                                min={0} max={0.3} step={0.01}
                                label={(value) => `${Math.round(value * 100)} %`}
                                value={horizontalPadding} onChange={onHorizontalPaddingChange}
                            />
                        </Stack>

                        <Stack gap={5}>
                            <FieldLabel text={"Vertical Separation"} icon={<IconSeparatorHorizontal size={16}/>}/>
                            <Slider
                                color="blue"
                                min={0} max={0.3} step={0.01}
                                label={(value) => `${Math.round(value * 100)} %`}
                                value={verticalPadding} onChange={onVerticalPaddingChange}
                            />
                        </Stack>

                        <Stack gap={"xs"}>
                            <Text>Components Alignment</Text>
                            <SegmentedControl
                                value={style.classes["container"].alignItems}
                                onChange={handleAlignItemsChange}
                                data={[
                                    {
                                        label: (
                                            <FieldLabel text={"Left"} icon={<IconAlignLeft size={16}/>}/>
                                        ), value: 'flex-start'
                                    },
                                    {
                                        label: (
                                            <FieldLabel text={"Center"} icon={<IconAlignCenter size={16}/>}/>
                                        ),
                                        value: 'center'
                                    },
                                    {
                                        label: (
                                            <FieldLabel text={"Right"} icon={<IconAlignRight size={16}/>}/>
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
