import {Button, Group, Stack, Text, Timeline, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";

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