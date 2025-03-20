import {Alert, Button, Group, Modal, Stack} from '@mantine/core';
import axios from 'axios';

interface Props {
    opened: boolean;
    close: () => void;
    portfolioUrl: string,
    onDelete: () => Promise<void>;
}

export default function DeletePortfolioModal({opened, close, portfolioUrl, onDelete}: Props) {
    async function deletePortfolio() {
        await axios.delete(`http://localhost:3000/portfolio/${portfolioUrl}`, {withCredentials: true});
        await onDelete();
        close();
    }

    return (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
            <Alert color="red">
                <Stack>
                    Are you sure you want to delete this portfolio?
                    <Group>
                        <Button variant="danger" onClick={deletePortfolio}>Delete</Button>
                        <Button variant="outline" onClick={close}>Cancel</Button>
                    </Group>
                </Stack>
            </Alert>
        </Modal>

    );
}