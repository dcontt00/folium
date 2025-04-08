import {Accordion, Button, Group, List, Stack, Text, ThemeIcon, Timeline, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";
import {IconEdit, IconPlus, IconTrash} from "@tabler/icons-react";

interface Version {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    url: string;
    components: Array<any>;
    portfolioId: string;
}

interface Props {
    portfolioId: string;
}

export default function History({portfolioId}: Props) {
    const [data, setData] = useState<Version[] | null>(null);
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
        <Stack p="sm">
            <Title order={3}>History</Title>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}

            <Timeline active={1} bulletSize={24} lineWidth={2}>
                {data && data.map((version: Version) => (
                    <Timeline.Item title="Change">
                        <Text c="dimmed" size="sm">{version.title}</Text>
                        <Text size="xs" mt={4}>{version.createdAt}</Text>
                        <Accordion>
                            <Accordion.Item value="Changes">
                                <Accordion.Control>Changes</Accordion.Control>
                                <Accordion.Panel>
                                    <List>
                                        <List.Item
                                            icon={
                                                <ThemeIcon color="red" size={24} radius="xl">
                                                    <IconTrash size={16}/>
                                                </ThemeIcon>
                                            }
                                        >
                                            Removed TextComponent
                                        </List.Item>
                                        <List.Item
                                            icon={
                                                <ThemeIcon color="green" size={24} radius="xl">
                                                    <IconPlus size={16}/>
                                                </ThemeIcon>
                                            }
                                        >
                                            Added Image
                                        </List.Item>
                                        <List.Item
                                            icon={
                                                <ThemeIcon color="blue" size={24} radius="xl">
                                                    <IconEdit size={16}/>
                                                </ThemeIcon>
                                            }
                                        >
                                            Changed title
                                        </List.Item>
                                    </List>
                                </Accordion.Panel>
                            </Accordion.Item>

                        </Accordion>
                        <Group>
                            <Button size="compact-md">Restore to this</Button>
                            <Button size="compact-md">Preview</Button>
                        </Group>

                    </Timeline.Item>
                ))}
            </Timeline>
        </Stack>
    );
}