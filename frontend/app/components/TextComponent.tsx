import {ActionIcon, Indicator, Text, Textarea} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";
import type {TextComponentType} from "../../../common/interfaces/interfaces";

interface TextComponentProps {
    textComponent: TextComponentType;
    edit: boolean;
    setEditComponent: (component: TextComponentType) => void;

}

export default function TextComponent({textComponent, edit, setEditComponent}: TextComponentProps) {
    return (
        <>
            {edit ? (
                <Textarea value={textComponent.text} onChange={(event) => console.log(event.target.value)}/>
            ) : (
                <Indicator
                    label={
                        <ActionIcon
                            variant="filled"
                            aria-label="Settings"
                            onClick={() =>
                                setEditComponent(textComponent)
                            }
                        >
                            <IconAdjustments style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon>
                    }
                    color="transparent"
                >
                    <Text>{textComponent.text}</Text>
                </Indicator>
            )}
        </>
    )
}