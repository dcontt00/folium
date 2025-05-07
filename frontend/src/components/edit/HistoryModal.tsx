import {Button, Group, List, Modal, Stack, Text, ThemeIcon, Timeline} from "@mantine/core";
import {useEffect, useState} from "react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";
import {IconEdit, IconEye, IconPlus, IconRestore, IconTrash} from "@tabler/icons-react";
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
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

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

    async function fetchVersion(version: IVersion) {
        try {
            const response = await axiosInstance.get(`${config.BACKEND_URL}/portfolio/version/${version._id}`);
            setPortfolioState(response.data.data);
            setCurrentVersionIndex(0);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
            onClose()

        }
    }

    async function restoreVersion(versionId: string, index: number) {
        try {
            const response = await axiosInstance.get(`${config.BACKEND_URL}/portfolio/version/${versionId}?restore=true`);
            setPortfolioState(response.data.data);
            setCurrentVersionIndex(0)
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
                <Timeline active={5 - currentVersionIndex - 1} reverseActive bulletSize={24} lineWidth={2}>
                    {data && data.map((version: IVersion, index: number) => (
                        <Timeline.Item title={version.relativeCreatedAt}>
                            <Stack
                                p="xs"
                                style={{
                                    paddingTop: 10,
                                    backgroundColor: currentVersionIndex === index ? "rgba(255, 255, 255, 0.1)" : "transparent",
                                }}
                            >
                                <List>
                                    {version.changes.map((change: IChange) => (
                                        <ChangeDetails change={change}/>
                                    ))}
                                </List>
                                <Group hidden={index === 0}>
                                    <Button
                                        leftSection={<IconRestore/>}
                                        size="compact-md"
                                        onClick={() => restoreVersion(version._id, index)}
                                    >
                                        Restore
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconEye/>}
                                        size="compact-md"
                                        onClick={() => fetchVersion(version)}
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

interface ChangeDetailsProps {
    change: IChange;
}

function ChangeDetails({change}: ChangeDetailsProps) {
    return (
        <List>
            {change.portfolioCreated && (
                <List.Item icon={<ThemeIcon color="green" size={24} radius="xl">
                    <IconPlus size={16}/>
                </ThemeIcon>}>
                    <Text>Portfolio Created</Text>
                </List.Item>
            )}
            {change.componentChanges.map((componentChange) => (
                <List.Item
                    icon={
                        <ThemeIcon color="orange" size={24} radius="xl">
                            <IconEdit size={16}/>
                        </ThemeIcon>
                    }
                >
                    <Text>{componentChange.component.__t}</Text>

                    <List listStyleType="disc">
                        {componentChange.changes.map((c) => (
                            <List.Item>
                                {c.attribute}: {c.oldValue} -{'>'} {c.newValue}
                            </List.Item>
                        ))}
                    </List>
                </List.Item>
            ))}
            {change.portfolioChanges && (

                <List.Item icon={<ThemeIcon color="green" size={24} radius="xl">
                    <IconEdit size={16}/>
                </ThemeIcon>}>
                    <Text>Portfolio Changes: {change.portfolioChanges}</Text>
                </List.Item>
            )}
            {change.componentAdditions && (
                <List.Item icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                        <IconPlus size={16}/>
                    </ThemeIcon>
                }>
                    <Text>Component Additions: {change.componentAdditions}</Text>
                </List.Item>
            )}
            {change.componentRemovals && (
                <List.Item icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                        <IconTrash size={16}/>
                    </ThemeIcon>
                }>
                    <Text>Component Removals: {change.componentRemovals}</Text>
                </List.Item>
            )}
        </List>
    );
}