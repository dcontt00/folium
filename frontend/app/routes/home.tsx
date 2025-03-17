import type {Route} from "./+types/home";
import {Welcome} from "../welcome/welcome";
import {AppShell, Burger, Button, Combobox, Skeleton, Stack, Group, TextInput, Checkbox, Fieldset} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useDisclosure} from "@mantine/hooks";
import axios from "axios";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

interface EditUserValues {
    email: string;
    username: string;
    name: String,
    surname: String
}


interface User {
    name: string,
    surname: string,
    email: string,
    username: string
}

function EditUser() {


    const form = useForm<EditUserValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            username: '',
            name: '',
            surname: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    async function getUserData(): Promise<User> {
        return await axios.get('http://localhost:3000/user', {withCredentials: true})
            .then((response) => {
                return response.data[0];
            })
            .catch((error) => {
                return {
                    name: '',
                    surname: '',
                    email: '',
                    username: ''
                };
                console.log(error);
            });
    }

    async function editUser(user: EditUserValues) {
        console.log(user);
        await axios.put('http://localhost:3000/user/' + user.username, user, {withCredentials: true})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <form onSubmit={form.onSubmit(async values => editUser(values))}>
            <Stack>
                <Fieldset legend="Personal information">

                    <TextInput
                        withAsterisk
                        label="Email"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                    <TextInput
                        withAsterisk
                        label="Username"
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                    />
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
                </Fieldset>
                <Button type="submit">
                    Submit
                </Button>
                <Button onClick={() => getUserData().then((data) => form.initialize(data))}>
                    Get user data
                </Button>
            </Stack>
        </form>
    )
}

function GetUsers() {
    const [users, setUsers] = useState([])

    async function makeGetRequest() {
        await axios.get('http://localhost:3000/user', {withCredentials: true})
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return (
        <div>
            <Button onClick={makeGetRequest}>Get Users</Button>
            {users.map((user: any) => {
                return (
                    <div key={user.id}>
                        <h1>{user.name}</h1>
                        <h2>{user.email}</h2>
                    </div>
                )
            })}
        </div>
    )
}

interface FormValues {
    email: string;
    password: string;
}

function Login() {
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
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                Navbar
                {Array(15)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt="sm" animate={false}/>
                    ))}
            </AppShell.Navbar>
            <AppShell.Main>
                <GetUsers/>
                <Login/>
                <EditUser/>
            </AppShell.Main>
        </AppShell>
    );
}

