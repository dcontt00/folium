import {Alert, AppShell, Button, Stack} from "@mantine/core";
import axios, {type AxiosResponse} from "axios";
import {IconInfoCircle} from "@tabler/icons-react"

import type {ComponentType, Portfolio} from "../../../../common/interfaces/interfaces";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {data, useNavigate} from "react-router";
import type {Route} from "../+types";
import EditComponentSection from "~/components/edit/EditComponentSection";
import ConfirmModal from "~/components/ConfirmModal";
import Component from "~/components/portfolioComponents/Component";
import "./styles.css"
import AddComponentMenu from "~/components/edit/AddComponentMenu";
import SettingsSection from "~/components/edit/editComponents/SettingsSection";
import HeaderButtons from "~/components/edit/HeaderButtons";

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

    function onRemoveComponent(component: ComponentType) {
        const index = portfolioState.components.findIndex((c) => c._id === component._id);
        const newPortfolio = {...portfolioState};
        newPortfolio.components.splice(index, 1);

        // Change index of the portfolioComponents
        for (let i = index; i < newPortfolio.components.length; i++) {
            newPortfolio.components[i].index = i;
        }
        setPortfolioState(newPortfolio);
        setEditComponent(undefined)
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

    function onAddComponent(component: ComponentType) {
        const newPortfolio = {...portfolioState};
        newPortfolio.components.push(component);
        setPortfolioState(newPortfolio);
        setUnsaved(true);
        setEditComponent(portfolioState.components[portfolioState.components.length - 1]);

    }

    return (
        <AppShell
            header={{height: 60}}
            aside={{width: 300, breakpoint: "sm", collapsed: {mobile: !openedSettings, desktop: !openedSettings}}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !openedEditComponent}}}
            padding="md"
        >
            <AppShell.Header>
                <HeaderButtons onBack={onBack} onSave={onSave} toggleOpenedSettings={toggleOpenedSettings}
                               unsaved={unsaved} portfolio={portfolio}/>
            </AppShell.Header>
            <AppShell.Navbar>
                <Stack p="sm">
                    <AddComponentMenu portfolio={portfolio} onAddComponent={onAddComponent}/>

                    {editComponent ? (
                            <EditComponentSection
                                component={editComponent}
                                onEditComponent={onEditComponent}
                                onRemoveComponent={onRemoveComponent}
                            />
                        ) :
                        (
                            <Alert variant="light" color="blue" title="Select a component to edit it"
                                   icon={<IconInfoCircle/>}/>
                        )
                    }
                    <Button hiddenFrom="sm" onClick={toggleOpenedEditComponent}>Close</Button>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Aside>
                <SettingsSection
                    toggleOpenedSettings={toggleOpenedSettings}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    setUnsaved={setUnsaved}
                />

            </AppShell.Aside>
            <AppShell.Main>
                <Stack align="center">
                    {portfolioState.components.map((component, index) => (
                        <div className="edit"
                             onClick={() => onSelectEditComponent(component)}
                             key={index}
                        >
                            <Component component={component}/>
                        </div>
                    ))}
                </Stack>

            </AppShell.Main>

            <ConfirmModal opened={openedBackModal} text="You have unsaved changes. Want to continue?"
                          close={closeBackModal} onOk={() => navigate("/home")}/>

        </AppShell>
    )
}