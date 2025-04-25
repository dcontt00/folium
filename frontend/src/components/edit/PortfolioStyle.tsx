import {Accordion, Autocomplete, ColorInput, Stack} from "@mantine/core";
import {IconBrush} from "@tabler/icons-react";

export default function PortfolioStyle() {
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
                        />
                        <Autocomplete
                            label="Font"
                            data={['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Helvetica', 'Tahoma', 'Impact', 'Comic Sans MS']}
                        />
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}