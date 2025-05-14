import {Button, Group, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {isEmail, isNotEmpty, useForm} from '@mantine/form';
import {useNavigate} from "react-router";
import axiosInstance from "~/axiosInstance";


interface FormValues {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
}

function validatePassword(value: string): string | null {
    let errorMessage = 'Password must have: ';

    if (value.length < 8) {
        errorMessage += '8 characters, ';
    }
    if (!/[A-Z]/.test(value)) {
        errorMessage += '1 uppercase letter, ';
    }
    if (!/\d/.test(value)) {
        errorMessage += '1 number, ';
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
                    const key = error.response.data.key;
                    form.setFieldError(key, error.response.data.message);
                    console.log(error);
                })
        })}
        >
            <Stack
                align="stretch"
                justify="center"
                gap="md"
            >
                <Title order={3}>Register</Title>
                <Group grow>
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
                </Group>

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
                <PasswordInput
                    withAsterisk
                    label="Password"
                    key={form.key('password')}
                    style={{flex: 1}}
                    {...form.getInputProps('password')}
                />
                <Button type="submit" disabled={!form.isValid()}>Submit</Button>
            </Stack>
        </form>
    );
}



