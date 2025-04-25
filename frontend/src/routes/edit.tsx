import {ActionIcon, Alert, AppShell, Button, Stack, Text} from "@mantine/core";
import {IconInfoCircle, IconX} from "@tabler/icons-react";
import type {ComponentType, Portfolio} from "~/interfaces/interfaces";
import {useState} from "react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useLoaderData, useNavigate} from "react-router";
import EditComponentSection from "~/components/edit/EditComponentSection";
import AddComponentMenu from "~/components/edit/AddComponentMenu";
import SettingsSection from "~/components/edit/editComponents/SettingsSection";
import HeaderButtons from "~/components/edit/HeaderButtons";
import {type DropResult} from "@hello-pangea/dnd";
import ComponentsDnD from "~/components/edit/ComponentsDnD";
import axiosInstance from "~/axiosInstance";
import ComponentsSection from "~/components/ComponentsSection";
import HistoryModal from "~/components/edit/HistoryModal";
import {modals} from "@mantine/modals";
import PortfolioStyle from "~/components/edit/portfolioStyle";


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
    const rootStyle = portfolioState.style.classes.find(cls => cls.identifier === "root");
    const [description, setDescription] = useState(portfolioState.description);
    const [title, setTitle] = useState(portfolioState.title);
    const [fontFamily, setFontFamily] = useState(rootStyle?.textFont || "Arial");
    const [backgroundColor, setBackgroundColor] = useState(rootStyle?.backgroudColor || "var(--mantine-color-body)");

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


    // Navigate
    const navigate = useNavigate();

    // Hotkeys
    useHotkeys([
        ['ctrl+h', () => toggleHistoryModal()],
    ]);

    function onEditComponent(component: ComponentType) {
        setEditComponent(component);
        console.log(component)

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

        if (!unsaved) {
            return;
        }
        const newPortfolio = {...portfolioState};
        newPortfolio.title = title;
        newPortfolio.description = description;
        await axiosInstance.put(`/portfolio/${newPortfolio.url}`, newPortfolio).then((response) => {
            console.log(response);
            const updatedPortfolio = response.data.data;
            setPortfolioState(updatedPortfolio);
            // Update the editComponent if it exists
            if (editComponent) {
                const updatedComponent = updatedPortfolio.components.find(
                    (component: ComponentType) => component.componentId === editComponent.componentId
                );
                setEditComponent(updatedComponent);
            }
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
                    openHistoryModal={openHistoryModal}
                />
            </AppShell.Header>
            <AppShell.Navbar>
                <Stack p="sm" gap="md">
                    <AddComponentMenu
                        parent_id={portfolio._id}
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
                    <PortfolioStyle
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        backgroundColor={backgroundColor}
                        setBackgroundColor={setBackgroundColor}
                    />
                    <Button hiddenFrom="sm" onClick={toggleOpenedEditComponent}>Close</Button>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Aside>
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
                    backgroundColor: backgroundColor,
                }}


            >
                {previewEnabled ?
                    <>
                        <ActionIcon onClick={() => setPreviewEnabled(false)}>
                            <IconX/>
                        </ActionIcon>
                        <ComponentsSection components={portfolioState.components}/>
                    </>
                    :
                    <ComponentsDnD
                        onSelectEditComponent={onSelectEditComponent}
                        portfolioState={portfolioState}
                        onRemoveComponent={onRemoveComponent}
                        onDragEnd={onDragEnd}
                        onEditComponent={onEditComponent}
                        fontFamily={fontFamily}
                    />
                }
            </AppShell.Main>

            <HistoryModal
                portfolioId={portfolioState._id}
                opened={openedHistoryModal}
                onClose={closeHistoryModal}
                setPortfolioState={setPortfolioState}
            />
        </AppShell>
    );
}


