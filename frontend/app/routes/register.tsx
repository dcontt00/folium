import type {Route} from "./+types/home";
import {AppShell, Button, Container, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {isEmail, isNotEmpty, useForm} from '@mantine/form';
import {useNavigate} from "react-router";
import axiosInstance from "~/axiosInstance";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}


interface FormValues {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
}

function validatePassword(value: string): string | null {
    let errorMessage = 'Password must have: ';

    switch (true) {
        case value.length < 8:
            errorMessage += '8 characters, ';
        case !/[A-Z]/.test(value):
            errorMessage += '1 uppercase letter, ';
        case !/\d/.test(value):
            errorMessage += '1 number, ';
        case !/[!@#$%^&*]/.test(value):
            errorMessage += '1 special symbol. ';
    }

    if (errorMessage === 'Password must have: ') {
        return null;
    }

    return errorMessage
}

export default function Register() {
    const navigate = useNavigate();
    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
        },
        validateInputOnChange: true,

        validate: {
            email: isEmail('Invalid email'),
            password: validatePassword,
            name: isNotEmpty('Name required'),
            surname: isNotEmpty('Surname required'),
            username: isNotEmpty('Username required'),
        },

    });


    return (
        <form onSubmit={form.onSubmit(async (values) => {
            await axiosInstance.post(`/register`, values)
                .then((response) => {
                    console.log(response);
                    navigate('/login');
                })
                .catch((error) => {
                    console.log(error);
                })
        })}
        >
            <AppShell
                padding="xl"
            >
                <AppShell.Main>
                    <Container size="xs">


                        <Stack
                            align="stretch"
                            justify="center"
                            gap="md"
                        >
                            <Title order={3}>Register</Title>
                            <TextInput
                                withAsterisk
                                label="Name"
                                key={form.key('name')}
                                {...form.getInputProps('name')}
                            />

                            <TextInput
                                withAsterisk
                                label="Surname"
                                key={form.key('surname')}
                                {...form.getInputProps('surname')}
                            />
                            <TextInput
                                withAsterisk
                                label="Username"
                                key={form.key('username')}
                                {...form.getInputProps('username')}
                            />

                            <TextInput
                                withAsterisk
                                label="Email"
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                withAsterisk
                                label="Password"
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                            />


                            <Button type="submit" disabled={!form.isValid()}>Submit</Button>
                        </Stack>
                    </Container>
                </AppShell.Main>
            </AppShell>
        </form>
    );
}



