import type {Route} from "./+types/home";
import {Button, PasswordInput, Stack, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';
import axios from "axios";
import {useNavigate} from "react-router";

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

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });


    return (
        <form onSubmit={form.onSubmit(async (values) => {
            await axios.post('http://localhost:3000/register', values, {withCredentials: true})
                .then((response) => {
                    console.log(response);
                    navigate('/login');
                })
                .catch((error) => {
                    console.log(error);
                })
        })}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="md"
            >
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


                <Button type="submit">Submit</Button>
            </Stack>
        </form>
    );
}



