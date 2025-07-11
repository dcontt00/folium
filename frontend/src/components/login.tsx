import {Button, Image, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useForm} from '@mantine/form';
import {useNavigate} from "react-router";
import axiosInstance from "~/axiosInstance";
import logo from "~/Logo.png"

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
            await axiosInstance.post(`/login`, values)
                .then(async (response) => {
                    localStorage.setItem("token", response.data.token);
                    await navigate('/home');
                })
                .catch((error) => {
                    form.setFieldError('password', 'Invalid email or password');
                })
        })}
        >
            <Stack align={"center"}>
                <Image src={logo} alt="Folium Logo" w={"50%"}/>
                <Title order={3}>Login</Title>

                <TextInput
                    withAsterisk
                    style={{width: '100%'}}
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    style={{width: '100%'}}
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <Button
                    type="submit"
                    disabled={!form.isDirty("email") || !form.isDirty("password")}
                >
                    Submit
                </Button>
            </Stack>
        </form>
    );
}



