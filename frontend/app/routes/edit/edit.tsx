import {AppShell, Button, Group, Stack, Textarea, TextInput, Title} from "@mantine/core";
import axios from "axios";
import {IconArrowLeft, IconDeviceFloppy} from "@tabler/icons-react"

import type {ComponentType, Portfolio} from "../../../../common/interfaces/interfaces";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import ComponentsSection from "~/routes/edit/ComponentsSection";
import {useNavigate} from "react-router";
import type {Route} from "../+types";
import EditComponentSection from "~/routes/edit/EditComponentSection";

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
    const [openedEditComponent, {toggle: toggleOpenedEditComponent}] = useDisclosure(false);
    const [openedSettings, {toggle: toggleOpenedSettings}] = useDisclosure(false);

    const navigate = useNavigate();
    const [editComponent, setEditComponent] = useState<ComponentType | undefined>(undefined);


    function onEditComponent(component: ComponentType) {
        setEditComponent(component);

        // Update the component in the portfolio
        const index = portfolioState.components.findIndex((c) => c._id === component._id);
        const newPortfolio = {...portfolioState};
        newPortfolio.components[index] = component;
        setPortfolioState(newPortfolio);
    }

    function onSelecEditComponent(component: ComponentType) {
        setEditComponent(component);
        toggleOpenedEditComponent()
    }

    async function onSave() {
        console.log(portfolioState)
        await axios.put(`http://localhost:3000/portfolio/${portfolioState.url}`, portfolioState, {withCredentials: true}).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }


    return (
        <AppShell
            header={{height: 60}}
            aside={{width: 300, breakpoint: "sm", collapsed: {mobile: !openedSettings}}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !openedEditComponent}}}
            padding="md"
        >
            <AppShell.Header>
                <Group>
                    <div>Logo</div>
                    <Button leftSection={<IconArrowLeft/>} onClick={() => navigate("/home")}>Go Back</Button>
                    <Button leftSection={<IconDeviceFloppy/>} onClick={onSave}>Save</Button>
                    <Button leftSection={<IconDeviceFloppy/>} onClick={toggleOpenedSettings}>Settings</Button>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                {editComponent && (
                    <EditComponentSection
                        component={editComponent}
                        onEditComponent={onEditComponent}
                        onOk={toggleOpenedEditComponent}
                    />
                )}
            </AppShell.Navbar>
            <AppShell.Aside>
                <Stack p="sm">
                    <Title order={3}>Settings</Title>
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
                </Stack>

            </AppShell.Aside>
            <AppShell.Main>
                <ComponentsSection
                    portfolio={portfolioState}
                    onSelectEditComponent={onSelecEditComponent}
                />

            </AppShell.Main>

        </AppShell>
    )
}