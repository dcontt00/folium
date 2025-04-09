import {Button, Group, List, Modal, Stack, Text, ThemeIcon, Timeline, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";
import {IconEdit, IconPlus, IconTrash} from "@tabler/icons-react";
import type IVersion from "~/interfaces/IVersion";
import type {IChange} from "~/interfaces/IChange";


interface Props {
    portfolioId: string;
    opened: boolean;
    onClose: () => void;
}

export default function HistoryModal({portfolioId, opened, onClose}: Props) {
    const [data, setData] = useState<IVersion[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
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

        fetchHistory();
    }, [portfolioId]);

    return (
        <Modal size="xl" opened={opened} onClose={onClose}>

            <Stack p="sm">
                <Title order={3}>History</Title>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}

                <Timeline active={1} bulletSize={24} lineWidth={2}>
                    {data && data.map((version: IVersion) => (
                        <Timeline.Item title="Change">
                            <Text size="xs" mt={4}>{version.createdAt}</Text>
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

                            <Group>
                                <Button size="compact-md">Restore to this</Button>
                                <Button size="compact-md">Preview</Button>
                            </Group>

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