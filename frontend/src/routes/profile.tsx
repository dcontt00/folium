import {
    ActionIcon,
    AppShell,
    Avatar,
    Button,
    Center,
    FileButton,
    Indicator,
    Stack,
    TextInput,
    Title
} from "@mantine/core";
import {useState} from "react";
import {useLoaderData} from "react-router";
import {IconDeviceFloppy, IconEdit} from "@tabler/icons-react";
import axiosInstance from "~/axiosInstance";
import {useForm} from "@mantine/form";
import config from "~/config";
import {Helmet} from "react-helmet";

export default function Profile() {

    const user = useLoaderData();
    const [edit, setEdit] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);

    const form = useForm(
        {
            mode: 'uncontrolled',
            initialValues: {
                username: user.username,
                name: user.name,
                surname: user.surname,
                email: user.email,
            },
        }
    )

    async function handleSave() {

        if (avatar) {
            const formData = new FormData();
            formData.append("upload", avatar);
            await axiosInstance.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then(async (response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }

        await axiosInstance.put('/user', form.getValues()).then(async (response) => {
            console.log(response);
            setEdit(false);
        }).catch((error) => {
            console.log(form.errors)

            if (error.response.data.message.includes("email")) {
                form.setFieldError('email', 'Email already exists');
            } else {
                form.setFieldError('username', 'Username already exists');
            }
            console.log(form.errors)
        })
    }

    return (
        <>
            <Helmet>
                <title>Folium - Profile</title>
            </Helmet>
            <form>

                <AppShell
                    padding={"xl"}
                >
                    <AppShell.Main>
                        <Stack pl={{sm: "20vw", md: "30vw"}} pr={{sm: "20vw", md: "30vw"}}>
                            <Center>
                                <Stack align={"center"}>
                                    <Title order={3}>Profile</Title>
                                    <Indicator
                                        position="bottom-end"
                                        color="transparent"
                                        size={40}
                                        disabled={!edit}
                                        label={
                                            <FileButton onChange={setAvatar} accept="image/png,image/jpeg">
                                                {(props) => (
                                                    <ActionIcon
                                                        radius="xl"
                                                        variant="filled"
                                                        size="xl"
                                                        {...props}
                                                    >
                                                        <IconEdit/>
                                                    </ActionIcon>
                                                )}
                                            </FileButton>
                                        }
                                    >
                                        <Avatar size={"10rem"}
                                                src={avatar ? URL.createObjectURL(avatar) : `${config.BACKEND_URL}/images/${user._id}.jpg`}
                                        />
                                    </Indicator>
                                </Stack>
                            </Center>
                            <TextInput
                                label="Name"
                                key={form.key('name')}
                                {...form.getInputProps('name')}
                                disabled={!edit}
                            />
                            <TextInput
                                label="Surname"
                                key={form.key('surname')}
                                {...form.getInputProps('surname')}
                                disabled={!edit}
                            />
                            <TextInput
                                label="Email"
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                                disabled={!edit}
                            />
                            <TextInput
                                label="Username"
                                key={form.key('username')}
                                {...form.getInputProps('username')}
                                disabled={!edit}
                            />

                            {edit ?
                                <Button
                                    leftSection={<IconDeviceFloppy/>}
                                    onClick={() => handleSave()}
                                    disabled={Object.keys(form.errors).length > 0}

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
            </form>
        </>
    );
}
