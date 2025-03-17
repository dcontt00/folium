import type {Route} from "./+types/home";
import {Button, Group, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useDisclosure} from "@mantine/hooks";
import axios from "axios";
import {useNavigate} from "react-router";

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


function Login() {
    const navigate = useNavigate();
    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });


    return (
        <form onSubmit={form.onSubmit(async (values) => {
            await axios.post('http://localhost:3000/login', values, {withCredentials: true})
                .then((response) => {
                    console.log(response);
                    navigate('/');
                })
                .catch((error) => {
                    console.log(error);
                })
        })}
        >
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <TextInput
                withAsterisk
                label="Password"
                key={form.key('password')}
                {...form.getInputProps('password')}
            />


            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}

export default function Home() {
    const [opened, {toggle}] = useDisclosure();

    return (
        <Login/>
    );
}

