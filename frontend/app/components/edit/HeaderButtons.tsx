import {ActionIcon, Avatar, Button, Group} from "@mantine/core";
import Logo from "~/Logo.svg";
import {IconArrowLeft, IconDeviceDesktop, IconDeviceFloppy, IconSettings} from "@tabler/icons-react";
import {useNavigate} from "react-router";

interface Props {
    onSave: () => void;
    onBack: () => void;
    toggleOpenedSettings: () => void;
    unsaved: boolean;
    portfolio: any;
}

export default function HeaderButtons({onSave, onBack, toggleOpenedSettings, unsaved, portfolio}: Props) {
    const navigate = useNavigate();

    return (
        <>
            <Group h="100%" px="md" visibleFrom="sm">
                <Avatar src={Logo} radius="xs"/>
                <Button leftSection={<IconArrowLeft/>} onClick={onBack}>Go Back</Button>
                <Button leftSection={<IconDeviceFloppy/>} onClick={onSave}
                        variant={unsaved ? "outline" : "filled"}>Save</Button>
                <Button leftSection={<IconDeviceDesktop/>}
                        onClick={() => navigate(`/preview/${portfolio.url}`)}>Preview</Button>
                <Button leftSection={<IconSettings/>} onClick={toggleOpenedSettings}>Settings</Button>
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
                <ActionIcon onClick={toggleOpenedSettings}>
                    <IconSettings/>
                </ActionIcon>
            </Group>
        </>
    )
}