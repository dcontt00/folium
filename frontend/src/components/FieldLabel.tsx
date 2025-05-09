import {Group, Text} from "@mantine/core";
import React from "react";

interface Props {
    text: string;
    icon: React.ReactNode;
}

export default function FieldLabel({text, icon}: Props) {
    return (
        <Group gap={5} align="center">
            {icon}
            <Text size="sm">{text}</Text>
        </Group>
    )
}