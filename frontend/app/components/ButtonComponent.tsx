import {ActionIcon, Button, Indicator, Textarea} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";

interface TextComponentProps {
    text: string;
    color: string;
    url: string;
    edit: boolean;
}

export default function ButtonComponent({text, color, url, edit}: TextComponentProps) {
    console.log(color)

    return (
        <>
            {edit ? (
                <Textarea value={text} onChange={(event) => console.log(event.target.value)}/>
            ) : (
                <Indicator
                    label={
                        <ActionIcon variant="filled" aria-label="Settings">
                            <IconAdjustments style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon>
                    }
                    color="transparent"
                >

                    <Button color={color} onClick={() => window.location.href = url}>{text}</Button>
                </Indicator>
            )}
        </>
    )
}