import {ActionIcon, Indicator} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";
import type {ComponentType} from "../../../../common/interfaces/interfaces";
import type {ReactNode} from "react";

interface BaseComponentProps<T extends ComponentType> {
    component: T;
    onSelectEditComponent: (component: T) => void;
    selectable?: boolean;
    children: ReactNode;
}

export default function BaseComponent<T extends ComponentType>(
    {
        component,
        onSelectEditComponent,
        selectable = false,
        children
    }: BaseComponentProps<T>) {
    return (
        <>
            {selectable ? (
                <Indicator
                    label={
                        <ActionIcon
                            variant="filled"
                            aria-label="Settings"
                            onClick={() =>
                                onSelectEditComponent(component)
                            }
                        >
                            <IconAdjustments style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon>
                    }
                    color="transparent"
                >
                    {children}
                </Indicator>
            ) : (
                children
            )}
        </>
    )
}