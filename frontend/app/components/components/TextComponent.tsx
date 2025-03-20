import BaseComponent from "./BaseComponent";
import type {TextComponentType} from "../../../../common/interfaces/interfaces";


import {Text} from "@mantine/core";

interface TextComponentProps {
    textComponent: TextComponentType;
    onSelectEditComponent: (component: TextComponentType) => void;
    selectable?: boolean;
}

export default function TextComponent({textComponent, onSelectEditComponent, selectable = false}: TextComponentProps) {
    return (
        <BaseComponent component={textComponent} onSelectEditComponent={onSelectEditComponent} selectable={selectable}>
            <Text>{textComponent.text}</Text>
        </BaseComponent>
    )
}