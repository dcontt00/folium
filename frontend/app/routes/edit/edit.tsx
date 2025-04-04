import {ActionIcon, Alert, AppShell, Button, Stack} from "@mantine/core";
import {type AxiosResponse} from "axios";
import {IconInfoCircle, IconX} from "@tabler/icons-react";

import type {ComponentType, Portfolio} from "~/interfaces/interfaces";
import {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {data, useNavigate} from "react-router";
import type {Route} from "../+types";
import EditComponentSection from "~/components/edit/EditComponentSection";
import ConfirmModal from "~/components/ConfirmModal";
import "./styles.css";
import AddComponentMenu from "~/components/edit/AddComponentMenu";
import SettingsSection from "~/components/edit/editComponents/SettingsSection";
import HeaderButtons from "~/components/edit/HeaderButtons";
import {type DropResult} from "@hello-pangea/dnd";
import ComponentsDnD from "~/components/edit/ComponentsDnD";
import axiosInstance from "~/axiosInstance";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const portfolio: Portfolio = await axiosInstance.get(`/portfolio/${params.url}`)
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio;
}

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
    const [unsaved, setUnsaved] = useState(false);
    const navigate = useNavigate();
    const [editComponent, setEditComponent] = useState<ComponentType | undefined>(undefined);
    const [previewEnabled, setPreviewEnabled] = useState(false);

    useEffect(() => {
          console.log(portfolioState)
    }, [portfolioState]);

    function onEditComponent(component: ComponentType) {
        //setEditComponent(component);

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

        for (let i = index; i < newPortfolio.components.length; i++) {
            newPortfolio.components[i].index = i;
        }
        setPortfolioState(newPortfolio);
        setEditComponent(undefined);
        setUnsaved(true);
    }

    function onSelectEditComponent(component: ComponentType) {
        setEditComponent(component);
        toggleOpenedEditComponent();
    }

    async function onSave() {
        const newPortfolio = {...portfolioState};
        newPortfolio.title = title;
        newPortfolio.description = description;
        await axiosInstance.put(`/portfolio/${newPortfolio.url}`, newPortfolio).then((response) => {
            console.log(response);
            const updatedPortfolio = response.data.data;
            setPortfolioState(updatedPortfolio);
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

    function onDragEnd(result: DropResult) {

        //TODO: Improve this
        console.log(result);
        if (!result.destination) {
            return;
        }

        const newComponents = Array.from(portfolioState.components);
        const [movedComponent] = newComponents.splice(result.source.index, 1);
        newComponents.splice(result.destination.index, 0, movedComponent);

        for (let i = 0; i < newComponents.length; i++) {
            newComponents[i].index = i;
        }

        const newPortfolio = {...portfolioState, components: newComponents};
        setPortfolioState(newPortfolio);
        setUnsaved(true);
    }

    return (
        <AppShell
            header={{height: 60, collapsed: previewEnabled}}
            aside={{
                width: 300,
                breakpoint: "sm",
                collapsed: {mobile: !openedSettings || previewEnabled, desktop: !openedSettings || previewEnabled}
            }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !openedEditComponent || previewEnabled, desktop: previewEnabled}
            }}
            padding="md"
        >
            <AppShell.Header>
                <HeaderButtons
                    onBack={onBack}
                    onSave={onSave}
                    onPreview={() => setPreviewEnabled(true)}
                    toggleOpenedSettings={toggleOpenedSettings}
                    unsaved={unsaved}
                    portfolio={portfolio}
                />
            </AppShell.Header>
            <AppShell.Navbar>
                <Stack p="sm" gap="md">
                    <AddComponentMenu
                        portfolio_id={portfolio._id}
                        portfolioComponentsLength={portfolio.components.length}
                        onAddComponent={onAddComponent}
                        allowContainerComponent={true}
                    />
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
                {previewEnabled && (
                    <ActionIcon onClick={() => setPreviewEnabled(false)}>
                        <IconX/>
                    </ActionIcon>
                )}
                <ComponentsDnD
                    onSelectEditComponent={onSelectEditComponent}
                    portfolioState={portfolioState}
                    onRemoveComponent={onRemoveComponent}
                    onDragEnd={onDragEnd}
                    onEditComponent={onEditComponent}
                />
            </AppShell.Main>

            <ConfirmModal opened={openedBackModal} text="You have unsaved changes. Want to continue?"
                          close={closeBackModal} onOk={() => navigate("/home")}/>
        </AppShell>
    );
}


