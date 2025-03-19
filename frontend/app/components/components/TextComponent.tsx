import {ActionIcon, Indicator, Text} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";
import type {TextComponentType} from "../../../../common/interfaces/interfaces";

interface TextComponentProps {
    textComponent: TextComponentType;
    onSelectEditComponent: (component: TextComponentType) => void;
}

export default function TextComponent({textComponent, onSelectEditComponent}: TextComponentProps) {
    return (
        <Indicator
            label={
                <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    onClick={() =>
                        onSelectEditComponent(textComponent)
                    }
                >
                    <IconAdjustments style={{width: '70%', height: '70%'}} stroke={1.5}/>
                </ActionIcon>
            }
            color="transparent"
        >
            <Text>{textComponent.text}</Text>
        </Indicator>
    )
}