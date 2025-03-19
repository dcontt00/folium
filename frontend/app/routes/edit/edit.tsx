import {AppShell, Burger, Button, Group, Stack, Textarea, TextInput, Title} from "@mantine/core";
import type {Route} from "../../../.react-router/types/app/routes";
import axios from "axios";
import {IconArrowLeft, IconDeviceFloppy} from "@tabler/icons-react"

import type Portfolio from "../../../../common/interfaces/portfolio";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import EditComponentsSection from "~/routes/edit/EditComponentsSection";

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
    const [portfolioState, setPortfolioState] = useState(portfolio);

    const [description, setDescription] = useState(portfolioState.description);
    const [title, setTitle] = useState(portfolioState.title);
    const [opened, {toggle}] = useDisclosure();


    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header>
                <Group>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Button leftSection={<IconArrowLeft/>} onClick={() => console.log("Go Back")}>Go Back</Button>
                    <Button leftSection={<IconDeviceFloppy/>} onClick={() => console.log("Save")}>Save</Button>
                    <div>Logo</div>
                </Group>
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
                    <Button>TextComponent</Button>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>
                <EditComponentsSection portfolio={portfolioState} setPortfolio={setPortfolioState}/>

            </AppShell.Main>

        </AppShell>
    )
}