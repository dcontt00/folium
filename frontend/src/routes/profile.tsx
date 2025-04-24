import {ActionIcon, AppShell, Avatar, Button, Center, Indicator, Stack, TextInput, Title} from "@mantine/core";
import {useState} from "react";
import {useLoaderData} from "react-router";
import {IconDeviceFloppy, IconEdit} from "@tabler/icons-react";

export default function Profile() {

    const user = useLoaderData();
    const [edit, setEdit] = useState(false);

    return (
        <AppShell
            padding={"xl"}
        >
            <AppShell.Main>
                <Stack p="xl">
                    <Center>
                        <Stack>
                            <Title order={3}>Profile</Title>
                            <Indicator
                                position="bottom-end"
                                color="transparent"
                                size={40}
                                label={
                                    <ActionIcon
                                        radius="xl"
                                        variant="filled"
                                        size="xl"
                                    >
                                        <IconEdit/>
                                    </ActionIcon>
                                }
                            >
                                <Avatar size={"10rem"}/>
                            </Indicator>
                        </Stack>
                    </Center>
                    <TextInput
                        label="Name"
                        value={user.name}
                        disabled={!edit}
                    />
                    <TextInput
                        label="Surname"
                        value={user.surname}
                        disabled={!edit}
                    />
                    <TextInput
                        label="Email"
                        value={user.email}
                        disabled={!edit}
                    />
                    <TextInput
                        label="Username"
                        value={user.username}
                        disabled={!edit}
                    />

                    {edit ?
                        <Button
                            leftSection={<IconDeviceFloppy/>}
                            onClick={() => setEdit(false)}
                        >
                            Save
                        </Button>
                        :
                        <Button
                            leftSection={<IconEdit/>}
                            onClick={() => setEdit(true)}
                        >
                            Edit
                        </Button>
                    }
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}