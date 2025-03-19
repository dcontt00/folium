import {ActionIcon, Button, Indicator} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";
import type {ButtonComponentType} from "../../../common/interfaces/interfaces";

interface TextComponentProps {
    buttonComponent: ButtonComponentType;
    setEditComponent: (component: ButtonComponentType) => void;
}

export default function ButtonComponent({buttonComponent, setEditComponent}: TextComponentProps) {

    return (
        <>
            <Indicator
                label={
                    <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        onClick={() => {
                            console.log(buttonComponent);
                            setEditComponent(buttonComponent)
                        }}
                    >
                        <IconAdjustments style={{width: '70%', height: '70%'}} stroke={1.5}/>
                    </ActionIcon>
                }
                color="transparent"
            >
                <Button
                    color={buttonComponent.color}
                    onClick={() => window.location.href = buttonComponent.url}
                >
                    {buttonComponent.text}
                </Button>
            </Indicator>
        </>
    )
}