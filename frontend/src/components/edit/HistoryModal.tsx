import {Button, Group, List, Modal, Stack, Text, ThemeIcon, Timeline} from "@mantine/core";
import {useEffect, useState} from "react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";
import {IconClipboard, IconEdit, IconEye, IconPlus, IconRestore, IconTrash} from "@tabler/icons-react";
import type IVersion from "~/interfaces/IVersion";
import type {IChange} from "~/interfaces/IChange";


interface Props {
    portfolioId: string;
    opened: boolean;
    onClose: () => void;
    setPortfolioState: (portfolio: any) => void;
}

export default function HistoryModal({portfolioId, opened, onClose, setPortfolioState}: Props) {
    const [data, setData] = useState<IVersion[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    async function fetchHistory() {
        try {
            const response = await axiosInstance.get(`${config.BACKEND_URL}/portfolio/${portfolioId}/versions`);
            console.log(response.data.data);
            setData(response.data.data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchVersion(versionId: string) {
        try {
            const response = await axiosInstance.get(`${config.BACKEND_URL}/portfolio/version/${versionId}`);
            console.log(response.data.data);
            setPortfolioState(response.data.data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
            onClose()

        }
    }

    async function restoreVersion(versionId: string) {
        try {
            const response = await axiosInstance.get(`${config.BACKEND_URL}/portfolio/version/${versionId}?restore=true`);
            setPortfolioState(response.data.data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
            onClose()
        }
    }

    useEffect(() => {
        if (opened) {
            fetchHistory();
        }

    }, [opened]);

    return (
        <Modal size="xl" opened={opened} onClose={onClose} title="History">
            <Stack p="sm">
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                <Timeline active={20} bulletSize={24} lineWidth={2}>
                    {data && data.map((version: IVersion, index: number) => (
                        <Timeline.Item title={version.relativeCreatedAt}>
                            <Stack style={{paddingTop: 10}}>
                                <List>
                                    {version.changes.map((change: IChange) => (
                                        <List.Item
                                            icon={
                                                <ChangeIcon change={change}/>
                                            }
                                        >
                                            <Text c="dimmed">
                                                {change.message}
                                            </Text>
                                        </List.Item>
                                    ))}
                                </List>

                                <Group hidden={index === 0}>
                                    <Button
                                        leftSection={<IconRestore/>}
                                        size="compact-md"
                                        onClick={() => restoreVersion(version._id)}
                                    >
                                        Restore
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconEye/>}
                                        size="compact-md"
                                        onClick={() => fetchVersion(version._id)}
                                    >
                                        Preview
                                    </Button>
                                </Group>
                            </Stack>

                        </Timeline.Item>
                    ))}
                </Timeline>
            </Stack>
        </Modal>
    );
}


interface IChangeIconProps {
    change: IChange;
}

function ChangeIcon({change}: IChangeIconProps) {
    switch (change.type) {
        case "NEW_PORTFOLIO":
            return (
                <ThemeIcon color="orange" size={24} radius="xl">
                    <IconClipboard size={16}/>
                </ThemeIcon>
            );
        case "ADD":
            return (
                <ThemeIcon color="blue" size={24} radius="xl">
                    <IconPlus size={16}/>
                </ThemeIcon>

            );
        case "REMOVE":
            return (
                <ThemeIcon color="red" size={24} radius="xl">
                    <IconTrash size={16}/>
                </ThemeIcon>
            )
        case "UPDATE":
            return (
                <ThemeIcon color="green" size={24} radius="xl">
                    <IconEdit size={16}/>
                </ThemeIcon>
            )
        default:
            return null;
    }
}