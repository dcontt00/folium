import type {Route} from "./+types/home";
import {AppShell, Button, Container, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useForm} from '@mantine/form';
import axios from "axios";
import {useNavigate} from "react-router";
import config from "~/config";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}


interface FormValues {
    email: string;
    password: string;
}


export default function Login() {
    const navigate = useNavigate();
    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length >= 1 ? null : 'Password is required'),
        },
    });


    return (
        <form onSubmit={form.onSubmit(async (values) => {
            await axios.post(`${config.BACKEND_URL}/login`, values, {withCredentials: true})
                .then(async (response) => {
                    await navigate('/home');
                })
                .catch((error) => {
                    form.setFieldError('password', 'Invalid email or password');
                })
        })}
        >
            <AppShell padding="md">
                <AppShell.Main>
                    <Container size="xs">
                        <Stack>
                            <Title order={3}>Login</Title>

                            <TextInput
                                withAsterisk
                                label="Email"
                                placeholder="your@email.com"
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Password"
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                            />
                            <Button type="submit"
                                    disabled={!form.isDirty("email") || !form.isDirty("password")}>Submit</Button>
                        </Stack>
                    </Container>
                </AppShell.Main>
            </AppShell>
        </form>
    );
}



