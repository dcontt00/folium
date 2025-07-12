import {Alert, AppShell, Button, Stack, Text} from "@mantine/core";
import {IconInfoCircle} from "@tabler/icons-react";
import type {ComponentType, Portfolio} from "~/interfaces/interfaces";
import {useEffect, useRef, useState} from "react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useLoaderData, useNavigate} from "react-router";
import EditComponentSection from "~/components/edit/EditComponentSection";
import AddComponentMenu from "~/components/edit/AddComponentMenu";
import SettingsSection from "~/components/edit/editComponents/SettingsSection";
import HeaderButtons from "~/components/edit/HeaderButtons";
import {type DropResult} from "@hello-pangea/dnd";
import ComponentsDnD from "~/components/edit/ComponentsDnD";
import axiosInstance from "~/axiosInstance";
import HistoryModal from "~/components/edit/HistoryModal";
import {modals} from "@mantine/modals";
import PortfolioStyle from "~/components/edit/portfolioStyle";
import type StyleClass from "~/interfaces/styleClass";
import {Helmet} from "react-helmet";


export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Edit() {
    const portfolio: Portfolio = useLoaderData();

    const openModal = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                You have unsaved changes. Want to continue?
            </Text>
        ),
        confirmProps: {},
        labels: {confirm: "Continue", cancel: 'Cancel'},
        onCancel: () => console.log('Cancel'),
        onConfirm: () => navigate("/home"),
    });


    // State for the portfolio
    const [portfolioState, setPortfolioState] = useState(portfolio);
    const [title, setTitle] = useState(portfolioState.title);
    const [description, setDescription] = useState(portfolioState.description);
    // Effect to set the portfolio state when the portfolio changes
    const isFirstRender = useRef(true);
    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (gotUpdatedPortfolio) {
            setGotUpdatedPortfolio(false)
            return;
        }
        setUnsaved(true);


    }, [portfolioState, title, description]);

    // State for components that can be shown or hidden
    const [openedEditComponent, {toggle: toggleOpenedEditComponent}] = useDisclosure(false);
    const [openedSettings, {toggle: toggleOpenedSettings}] = useDisclosure(false);
    const [openedHistoryModal, {
        open: openHistoryModal,
        close: closeHistoryModal,
        toggle: toggleHistoryModal
    }] = useDisclosure(false);


    // State for the edit features
    const [unsaved, setUnsaved] = useState(false);
    const [editComponent, setEditComponent] = useState<ComponentType | undefined>(undefined);
    const [previewEnabled, setPreviewEnabled] = useState(false);
    const [gotUpdatedPortfolio, setGotUpdatedPortfolio] = useState(false);


    // Navigate
    const navigate = useNavigate();

    // Hotkeys
    useHotkeys([
        ['ctrl+h', () => toggleHistoryModal()],
    ]);

    function onEditComponent(component: ComponentType) {
        setEditComponent(component);

        const index = portfolioState.components.findIndex((c) => c.componentId === component.componentId);
        const newPortfolio = {...portfolioState};
        newPortfolio.components[index] = component;
        setPortfolioState(newPortfolio);
    }

    function onRemoveComponent(component: ComponentType) {
        const index = portfolioState.components.findIndex((c) => c.componentId === component.componentId);
        const newPortfolio = {...portfolioState};
        newPortfolio.components.splice(index, 1);

        for (let i = index; i < newPortfolio.components.length; i++) {
            newPortfolio.components[i].index = i;
        }
        setPortfolioState(newPortfolio);
        setEditComponent(undefined);
    }

    function onSelectEditComponent(component: ComponentType) {
        setEditComponent(component);
        toggleOpenedEditComponent();
    }

    async function onSave() {

        if (!unsaved) {
            return;
        }
        const newPortfolio = {...portfolioState};
        newPortfolio.title = title;
        newPortfolio.description = description;
        await axiosInstance.put(`/portfolio/${newPortfolio.url}`, newPortfolio).then((response) => {
            const updatedPortfolio = response.data.data;
            setGotUpdatedPortfolio(true);
            setPortfolioState(updatedPortfolio);
            setEditComponent(updatedPortfolio.components);
        }).catch((error) => {
            console.log(error);
        });
        setUnsaved(false);
    }

    function onBack() {
        if (unsaved) {
            openModal();
        } else {
            navigate("/home");
        }
    }

    function onAddComponent(component: ComponentType) {
        const newPortfolio = {...portfolioState};
        newPortfolio.components.push(component);
        setPortfolioState(newPortfolio);
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

    function onStyleChange(identifier: string, attribute: string, value: string) {
        console.log(identifier, attribute, value);
        const newPortfolio = {...portfolioState};
        const styleClass = newPortfolio.style.classes?.[identifier]
        if (styleClass == null) {
            return
        }

        styleClass[attribute as keyof typeof styleClass] = value
        newPortfolio.style.classes[identifier] = styleClass
        setPortfolioState(newPortfolio);
        console.log("newportfolio", newPortfolio)

    }

    function onStyleClassAdd(styleClass: StyleClass) {
        const newPortfolio = {...portfolioState};
        newPortfolio.style.classes[styleClass.identifier] = styleClass
        setPortfolioState(newPortfolio);
    }

    return (
        <>
            <Helmet>
                <title>Folium - Edit</title>
            </Helmet>
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

            >
                <AppShell.Header>
                    <HeaderButtons
                        onBack={onBack}
                        onSave={onSave}
                        onPreview={() => setPreviewEnabled(true)}
                        toggleOpenedSettings={toggleOpenedSettings}
                        unsaved={unsaved}
                        portfolio={portfolio}
                        openHistoryModal={openHistoryModal}
                    />
                </AppShell.Header>
                <AppShell.Navbar
                    style={{overflowY: "auto"}}
                >
                    <Stack p="sm" gap="md">
                        <AddComponentMenu
                            parent_id={portfolio._id}
                            portfolioComponentsLength={portfolio.components.length}
                            onAddComponent={onAddComponent}
                            allowContainerComponent={true}
                            onStyleClassAdd={onStyleClassAdd}
                        />
                        {editComponent ? (
                                <EditComponentSection
                                    portfolioUrl={portfolio.url}
                                    component={editComponent}
                                    onEditComponent={onEditComponent}
                                    styleClass={portfolioState.style.classes?.[editComponent.className]}
                                    style={portfolioState.style}
                                    onStyleChange={onStyleChange}
                                />
                            ) :
                            (
                                <Alert variant="light" color="blue" title="Select a component to edit it"
                                       icon={<IconInfoCircle/>}/>
                            )
                        }
                        <PortfolioStyle
                            style={portfolioState.style}
                            onStyleChange={onStyleChange}
                        />
                        <Button hiddenFrom="sm" onClick={toggleOpenedEditComponent}>Close</Button>
                    </Stack>
                </AppShell.Navbar>
                <AppShell.Aside
                    style={{overflowY: "auto"}}
                >
                    <Stack p="sm">
                        <SettingsSection
                            toggleOpenedSettings={toggleOpenedSettings}
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            setUnsaved={setUnsaved}
                            portfolioUrl={portfolio.url}
                        />
                    </Stack>
                </AppShell.Aside>
                <AppShell.Main
                    style={{
                        backgroundColor: portfolioState.style.classes?.["root"].backgroundColor!!,
                        color: portfolioState.style.classes?.["root"].color!!,
                    }}
                >
                    <ComponentsDnD
                        onSelectEditComponent={onSelectEditComponent}
                        portfolioState={portfolioState}
                        onRemoveComponent={onRemoveComponent}
                        onDragEnd={onDragEnd}
                        onEditComponent={onEditComponent}
                        onStyleClassAdd={onStyleClassAdd}
                        style={portfolioState.style}
                    />
                </AppShell.Main>

                <HistoryModal
                    portfolioId={portfolioState._id}
                    opened={openedHistoryModal}
                    onClose={closeHistoryModal}
                    setPortfolioState={setPortfolioState}
                />
            </AppShell>
        </>
    );
}


