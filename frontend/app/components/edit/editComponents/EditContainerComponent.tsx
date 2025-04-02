import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces";
import {Stack} from "@mantine/core";
import EditComponentSection from "~/components/edit/EditComponentSection";

interface Props {
    containerComponent: ContainerComponentType;
    onEditComponent: (component: ComponentType) => void;
}

export default function EditContainerComponent({containerComponent, onEditComponent}: Props) {
    return (
        <Stack>
            {containerComponent.components.map((component: ComponentType, index: number) => (
                <EditComponentSection key={index} component={component}
                                      onEditComponent={(containerComponent) => onEditComponent(containerComponent)}/>
            ))}
        </Stack>
    );
}