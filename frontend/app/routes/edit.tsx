import {AppShell, Stack, Textarea, TextInput, Title} from "@mantine/core";
import type {Route} from "./+types";
import axios from "axios";

import type Portfolio from "../../../common/interfaces/portfolio";
import {useState} from "react";

// provides `loaderData` to the component
export async function clientLoader({params}: Route.ClientLoaderArgs) {
    console.log(`http://localhost:3000/portfolio/${params.url}`)
    const portfolio: Portfolio = await axios.get(`http://localhost:3000/portfolio/${params.url}`, {withCredentials: true}).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
    });
    return portfolio
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Edit({loaderData}: Route.ComponentProps) {
    const portfolio: Portfolio = loaderData;
    const [description, setDescription] = useState(portfolio.description);
    const [title, setTitle] = useState(portfolio.title);
    return (
        <AppShell
            navbar={{
                width: 300,
                breakpoint: 'sm',
            }}
            padding="md"
        >
            <AppShell.Navbar>
                <Stack>

                    <TextInput
                        label="Title"
                        value={title}
                        onChange={(event) => setTitle(event.currentTarget.value)}
                    />
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(event) => setDescription(event.currentTarget.value)}
                    />

                    <Title order={3}>Components</Title>
                </Stack>


            </AppShell.Navbar>
            <AppShell.Main>
                <h1>Edit</h1>
            </AppShell.Main>

        </AppShell>
    )
}