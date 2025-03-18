import {AppShell, Burger, Button, Stack, Textarea, TextInput, Title} from "@mantine/core";
import type {Route} from "./+types";
import axios from "axios";
import {IconArrowLeft} from "@tabler/icons-react"

import type Portfolio from "../../../common/interfaces/portfolio";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";

// provides `loaderData` to the component
export async function clientLoader({params}: Route.ClientLoaderArgs) {
    console.log(`http://localhost:3000/portfolio/${params.url}`)
    const portfolio: Portfolio = await axios.get(`http://localhost:3000/portfolio/${params.url}`, {withCredentials: true}).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
    });
    console.log(portfolio)
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
    const [opened, {toggle}] = useDisclosure();
    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
            }}
            padding="md"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />

                <Button onClick={() => console.log("Save")}>Save</Button>
                <Button leftSection={<IconArrowLeft/>} onClick={() => console.log("Go Back")}>Go Back</Button>
                <div>Logo</div>
            </AppShell.Header>
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
                {portfolio.components.map((component) => {
                    return (
                        <div key={component._id}>
                            {component.__t}
                        </div>
                    )
                })}

            </AppShell.Main>

        </AppShell>
    )
}