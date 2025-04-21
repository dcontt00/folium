import {ActionIcon, Avatar, Button, Group, Text, Tooltip} from "@mantine/core";
import Logo from "~/Logo.svg";
import {
    IconArrowLeft,
    IconConfetti,
    IconDeviceDesktop,
    IconDeviceFloppy,
    IconHistory,
    IconSettings
} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";

interface Props {
    onSave: () => void;
    onBack: () => void;
    toggleOpenedSettings: () => void;
    unsaved: boolean;
    portfolio: any;
    onPreview: () => void;
    openHistoryModal: () => void;
}

export default function HeaderButtons({
                                          onSave,
                                          onBack,
                                          toggleOpenedSettings,
                                          unsaved,
                                          portfolio,
                                          onPreview,
                                          openHistoryModal
                                      }: Props) {
    const navigate = useNavigate();
    const [tooltipOpened, setTooltipOpened] = useState(false);
    const hasMounted = useRef(false);
    useEffect(() => {
        if (hasMounted.current && !unsaved) {
            setTooltipOpened(true);
            const timer = setTimeout(() => setTooltipOpened(false), 2000);
            return () => clearTimeout(timer); // Cleanup the timer
        }
        hasMounted.current = true;
    }, [unsaved]);

    return (
        <>
            <Group h="100%" px="md" visibleFrom="sm">
                <Avatar src={Logo} radius="xs"/>
                <Button
                    leftSection={<IconArrowLeft/>}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Tooltip
                    label={
                        <Group>
                            <IconConfetti/>
                            <Text>Guardado</Text>
                        </Group>
                    }
                    opened={tooltipOpened}
                    position="top"
                >
                    <Button
                        leftSection={<IconDeviceFloppy/>}
                        onClick={onSave}
                        variant={unsaved ? "outline" : "filled"}
                    >
                        Save
                    </Button>
                </Tooltip>
                <Button
                    leftSection={<IconDeviceDesktop/>}
                    onClick={onPreview}
                >
                    Preview
                </Button>
                <Button
                    leftSection={<IconHistory/>}
                    onClick={openHistoryModal}
                >
                    History
                </Button>
                <Button
                    leftSection={<IconSettings/>}
                    onClick={toggleOpenedSettings}
                >
                    Settings
                </Button>
            </Group>
            <Group h="100%" px="md" hiddenFrom="sm">
                <Avatar src={Logo} radius="xs"/>
                <ActionIcon onClick={onBack}>
                    <IconArrowLeft/>
                </ActionIcon>

                <ActionIcon onClick={onSave} variant={unsaved ? "outline" : "filled"}>
                    <IconDeviceFloppy/>
                </ActionIcon>
                <ActionIcon onClick={() => navigate(`/preview/${portfolio.url}`)}>
                    <IconDeviceDesktop/>
                </ActionIcon>
                <ActionIcon onClick={openHistoryModal}>
                    <IconHistory/>
                </ActionIcon>
                <ActionIcon onClick={toggleOpenedSettings}>
                    <IconSettings/>
                </ActionIcon>
            </Group>
        </>
    )
}