import {Accordion, ColorInput, Select, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";
import FontsComboBox from "./FontsCombobox";
import {getContrastColor} from "~/utils";
import type Style from "~/interfaces/style";
import {useEffect, useState} from "react";

interface Props {
    style: Style
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}


export default function PortfolioStyle({style, onStyleChange}: Props) {
    const [alignItems, setAlignItems] = useState<string | null>("Left")

    useEffect(() => {
        switch (alignItems) {
            case "Left":
                onStyleChange("root", "alignItems", "flex-start");
                break;
            case "Center":
                onStyleChange("root", "alignItems", "center");
                break;
            case "Right":
                onStyleChange("root", "alignItems", "flex-end");
                break;
            default:
                onStyleChange("root", "alignItems", "flex-start");
        }
    }, [alignItems]);


    function handleBackgroundColorChange(color: string) {
        onStyleChange("root", "backgroundColor", color);
        const contrastedColor = getContrastColor(color)
        onStyleChange("root", "color", contrastedColor);
    }

    function handleAlignItemsChange(value: string | null) {
        if (!value) {
            return
        }
        onStyleChange("root", "alignItems", value);
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
                        <FontsComboBox fontFamily={style.classes?.["root"].textFont} onStyleChange={onStyleChange}
                                       identifier="root"/>
                        <Select
                            label="Components Alignment"
                            value={alignItems}
                            data={["Left", "Center", "Right"]}
                            onChange={(value) => setAlignItems(value)}
                        />
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}