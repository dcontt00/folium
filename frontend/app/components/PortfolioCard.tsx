import {Button, Card, Group, Image, Stack, Text} from "@mantine/core";
import {IconEdit, IconExternalLink, IconTrash} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import {useDisclosure} from "@mantine/hooks";
import ConfirmModal from "~/components/ConfirmModal";
import axios from "axios";

interface PortfolioCardProps {
    title: string;
    description: string;
    url: string;
    onDelete: () => Promise<void>;
}

export default function PortfolioCard({title, description, url, onDelete}: PortfolioCardProps) {
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure();

    async function deletePortfolio(portfolioUrl: string) {
        await axios.delete(`http://localhost:3000/portfolio/${portfolioUrl}`, {withCredentials: true});
        await onDelete();
        close();
    }


    return (
        <Card
            shadow="sm"
            padding="xl"
            component="a"
            target="_blank"
        >
            <Card.Section>
                <Image
                    src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                    h={160}
                    alt="No way!"
                />
            </Card.Section>
            <Stack>
                <Text fw={500} size="lg" mt="md">
                    {title}
                </Text>

                <Text c="dimmed" size="sm">
                    {description}
                </Text>
                <Group>

                    <Button
                        variant="default"
                        leftSection={<IconExternalLink size={14}/>}
                        onClick={() => navigate(url)}
                    >
                        Visit
                    </Button>
                    <Button
                        leftSection={<IconEdit size={14}/>}
                        onClick={() => navigate(`/edit/${url}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        leftSection={<IconTrash size={14}/>}
                        onClick={open}
                    >
                        Remove
                    </Button>
                </Group>
            </Stack>
            <ConfirmModal
                text="Are you sure you want to delete this portfolio?"
                opened={opened}
                close={close}
                onOk={() => deletePortfolio(url)}
            />
        </Card>
    );
}