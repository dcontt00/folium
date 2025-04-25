import {Accordion, ColorInput, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";
import type Portfolio from "~/interfaces/portfolio";
import FontsComboBox from "./FontsCombobox";

interface Props {
    portfolio: Portfolio
}


export default function PortfolioStyle({portfolio}: Props) {
    const rootStyle = portfolio.style.classes.find(cls => cls.identifier === "root");


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
                            value={rootStyle?.backgroudColor}
                        />
                        <FontsComboBox portfolio={portfolio}/>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}