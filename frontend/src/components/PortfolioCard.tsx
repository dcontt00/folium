import {Button, Card, Group, Image, Stack, Text} from "@mantine/core";
import {IconEdit, IconExternalLink, IconTrash} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import {useDisclosure} from "@mantine/hooks";
import axiosInstance from "~/axiosInstance";
import {modals} from "@mantine/modals";
import config from "~/config";

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
        await axiosInstance.delete(`/portfolio/${portfolioUrl}`);
        await onDelete();
        close();
    }

    const openModal = () => modals.openConfirmModal({
        title: 'Delete portfolio',
        children: (
            <Text size="sm">
                Are you sure you want to delete this portfolio?
            </Text>
        ),
        confirmProps: {
            color: "red",
            leftSection: <IconTrash/>
        },
        labels: {confirm: "Delete", cancel: 'Cancel'},
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deletePortfolio(url),
    });

    return (
        <Card
            shadow="sm"
            padding="xl"
            component="a"
            target="_blank"
        >
            <Card.Section inheritPadding px="xs" py="xs">
                <Image
                    src={`${config.BACKEND_URL}/images/thumbnails/${url}.png`}
                    h={160}
                    width="100%"
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
                        onClick={() => navigate(`/view/${url}`)}
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
                        color="red"
                        leftSection={<IconTrash size={14}/>}
                        onClick={openModal}
                    >
                        Remove
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}