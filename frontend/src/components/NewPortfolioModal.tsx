import {Button, Group, Modal, Stack, TextInput} from '@mantine/core';
import {isNotEmpty, matches, useForm} from '@mantine/form';
import {useNavigate} from "react-router";
import {IconCancel, IconFilePlus} from "@tabler/icons-react";
import axiosInstance from "~/axiosInstance";
import {useState} from "react";

interface Props {
    opened: boolean;
    close: () => void;
}

export default function NewPortfolioModal({opened, close}: Props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            url: "",
            description: '',
        },
        validateInputOnChange: true,

        validate: {
            title: isNotEmpty("Title required"),
            url: matches(/^[a-zA-Z0-9\-]+$/, 'Invalid URL, must contain only letters, numbers and "-"'),
        },
    });

    async function onSubmit(values: any) {
        setLoading(true);
        await axiosInstance.post(`/portfolio`, values).then(result => {
            console.log(result)
            navigate("/edit/" + values.url)
        }).catch(err => {
            if (err.response.data.message == "URL already exists") {
                form.setFieldError('url', 'URL already exists')
            }
            console.log(err)
        })
        setLoading(false);
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
                        <Button
                            leftSection={<IconFilePlus/>}
                            type="submit"
                            disabled={!form.isValid()}
                            loading={loading}
                        >
                            Create
                        </Button>
                        <Button variant="light" leftSection={<IconCancel/>} onClick={close}>Cancel</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>

    );
}