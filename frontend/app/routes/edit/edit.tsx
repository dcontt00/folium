import {Alert, AppShell, Avatar, Button, Group, Stack, Textarea, TextInput, Title} from "@mantine/core";
import axios, {type AxiosResponse} from "axios";
import {IconArrowLeft, IconDeviceDesktop, IconDeviceFloppy, IconInfoCircle, IconSettings} from "@tabler/icons-react"

import type {ComponentType, Portfolio} from "../../../../common/interfaces/interfaces";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {data, useNavigate} from "react-router";
import type {Route} from "../+types";
import EditComponentSection from "~/routes/edit/EditComponentSection";
import Logo from "app/Logo.svg";
import ConfirmModal from "~/components/ConfirmModal";
import Component from "~/components/components/Component";

// provides `loaderData` to the component
export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const portfolio: Portfolio = await axios.get(`http://localhost:3000/portfolio/${params.url}`, {withCredentials: true})
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Edit({loaderData}: Route.ComponentProps) {
    if (!loaderData) {
        return <div>Error: Portfolio data not found</div>;
    }

    const portfolio: Portfolio = loaderData;
    const [portfolioState, setPortfolioState] = useState(portfolio);

    const [description, setDescription] = useState(portfolioState.description);
    const [title, setTitle] = useState(portfolioState.title);
    const [openedEditComponent, {toggle: toggleOpenedEditComponent}] = useDisclosure(false);
    const [openedSettings, {toggle: toggleOpenedSettings}] = useDisclosure(false);
    const [openedBackModal, {open: openBackModal, close: closeBackModal}] = useDisclosure(false);
    const [unsaved, setUnsaved] = useState(false); // Use to check if the portfolio has been edited

    const navigate = useNavigate();
    const [editComponent, setEditComponent] = useState<ComponentType | undefined>(undefined);


    function onEditComponent(component: ComponentType) {
        setEditComponent(component);

        // Update the component in the portfolio
        const index = portfolioState.components.findIndex((c) => c._id === component._id);
        const newPortfolio = {...portfolioState};
        newPortfolio.components[index] = component;
        setPortfolioState(newPortfolio);
        setUnsaved(true);
    }

    function onSelectEditComponent(component: ComponentType) {
        setEditComponent(component);
        toggleOpenedEditComponent()
    }

    async function onSave() {
        const newPortfolio = {...portfolioState};
        newPortfolio.title = title;
        newPortfolio.description = description;
        await axios.put(`http://localhost:3000/portfolio/${newPortfolio.url}`, newPortfolio, {withCredentials: true}).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
        setUnsaved(false);
    }

    function onBack() {
        if (unsaved) {
            openBackModal();
        } else {
            navigate("/home");
        }
    }

    return (
        <AppShell
            header={{height: 60}}
            aside={{width: 300, breakpoint: "sm", collapsed: {mobile: !openedSettings, desktop: !openedSettings}}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !openedEditComponent}}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Avatar src={Logo} radius="xs"/>
                    <Button leftSection={<IconArrowLeft/>} onClick={onBack}>Go Back</Button>
                    <Button leftSection={<IconDeviceFloppy/>} onClick={onSave}
                            variant={unsaved ? "outline" : "filled"}>Save</Button>
                    <Button leftSection={<IconDeviceDesktop/>}
                            onClick={() => navigate(`/preview/${portfolio.url}`)}>Preview</Button>
                    <Button leftSection={<IconSettings/>} onClick={toggleOpenedSettings}>Settings</Button>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <Stack p="sm">

                    {editComponent ? (
                            <EditComponentSection
                                component={editComponent}
                                onEditComponent={onEditComponent}
                            />
                        ) :
                        (
                            <Alert variant="light" color="blue" title="Select a component to edit it"
                                   icon={<IconInfoCircle/>}/>
                        )
                    }
                </Stack>
                <Button hiddenFrom="sm">Close</Button>
            </AppShell.Navbar>
            <AppShell.Aside>
                <Stack p="sm">
                    <Title order={3}>Settings</Title>
                    <TextInput
                        label="Title"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.currentTarget.value)
                            setUnsaved(true);
                        }}
                    />
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.currentTarget.value)
                            setUnsaved(true);
                        }}
                    />
                </Stack>

            </AppShell.Aside>
            <AppShell.Main>
                <div>
                    <Stack align="center">
                        {portfolioState.components.map((component, index) => (
                            <div
                                style={{backgroundColor: "blue", padding: "1em"}}
                                onClick={() => onSelectEditComponent(component)}
                                key={index}
                            >
                                <Component component={component}/>
                            </div>
                        ))}
                    </Stack>
                </div>

            </AppShell.Main>

            <ConfirmModal opened={openedBackModal} text="You have unsaved changes. Want to continue?"
                          close={closeBackModal} onOk={() => navigate("/home")}/>

        </AppShell>
    )
}