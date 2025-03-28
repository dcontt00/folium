import {Button, Group, Modal, Stack, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import axios from 'axios';
import {useNavigate} from "react-router";
import {IconCancel, IconDeviceFloppy} from "@tabler/icons-react";

interface Props {
    opened: boolean;
    close: () => void;
}

export default function NewPortfolioModal({opened, close}: Props) {
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            url: "",
            description: '',
        },

        validate: {
            url: (value: string) => (/[a-zA-Z0-9\-\/]*$/.test(value) ? null : 'Invalid URL'),
        },
    });

    async function onSubmit(values: any) {
        await axios.post('http://localhost:3000/portfolio', values, {withCredentials: true}).then(result => {
            console.log(result)
            navigate("/edit/" + values.url)
        }).catch(err => {
            if (err.response.data.message == "URL already exists") {
                form.setFieldError('url', 'URL already exists')
            }
            console.log(err)
        })
    }


    return (
        <Modal opened={opened} onClose={close} title="New Portfolio">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack gap="md">
                    <TextInput
                        withAsterisk
                        label="Title"
                        placeholder="Your portfolio"
                        key={form.key('title')}
                        {...form.getInputProps('title')}
                    />
                    <TextInput
                        withAsterisk
                        label="Url"
                        placeholder="your-portfolio"
                        key={form.key('url')}
                        {...form.getInputProps('url')}
                    />
                    <TextInput
                        label="Description"
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />
                    <Group>
                        <Button leftSection={<IconDeviceFloppy/>} type="submit">Save</Button>
                        <Button variant="light" leftSection={<IconCancel/>} onClick={close}>Cancel</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>

    );
}