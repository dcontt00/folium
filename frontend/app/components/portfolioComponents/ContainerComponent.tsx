import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";
import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {IconEdit, IconMenu2, IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import {useState} from "react";
import AddComponentMenu from "~/components/edit/AddComponentMenu";

interface Props {
    containerComponent: ContainerComponentType,
    onEditComponent: (component: ComponentType) => void;
    onSelectEditComponent: (component: ComponentType) => void;
}

export default function ContainerComponent({containerComponent, onEditComponent, onSelectEditComponent}: Props) {

    const [containerState, setContainerState] = useState(containerComponent);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const newComponents = Array.from(containerComponent.components);
        const [movedComponent] = newComponents.splice(result.source.index, 1);
        newComponents.splice(result.destination.index, 0, movedComponent);

        for (let i = 0; i < newComponents.length; i++) {
            newComponents[i].index = i;
        }

        const newContainer = {...containerState, components: newComponents};
        console.log(newContainer);
        setContainerState(newContainer);
        onEditComponent(newContainer)
    };

    function onAddComponent(component: ComponentType) {
        const newComponents = [...containerState.components, component];
        const newContainer = {...containerState, components: newComponents};
        setContainerState(newContainer);
        onEditComponent(newContainer);
    }

    function onRemoveComponent(component: ComponentType) {
        const index = containerState.components.findIndex((c) => c._id === component._id);
        const newComponents = [...containerState.components];
        newComponents.splice(index, 1);

        for (let i = index; i < newComponents.length; i++) {
            newComponents[i].index = i;
        }

        const newContainer = {...containerState, components: newComponents};
        setContainerState(newContainer);
        onEditComponent(newContainer);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="containerComponents" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}
                             style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
                            {containerState.components.map((component: ComponentType, index: number) => (
                                <Draggable key={component._id} draggableId={index.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="containerComponent"
                                        >
                                            <IconMenu2 className="icon"/>
                                            <Component component={component} onEditComponent={onEditComponent}
                                                       onSelectEditComponent={onSelectEditComponent}/>
                                            <ActionIcon className="icon"
                                                        onClick={() => onSelectEditComponent(component)}>
                                                <IconEdit/>
                                            </ActionIcon>
                                            <ActionIcon color="red" className="icon"
                                                        onClick={() => onRemoveComponent(component)}>
                                                <IconTrash/>
                                            </ActionIcon>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddComponentMenu
                portfolio_id={containerComponent.portfolio_id}
                portfolioComponentsLength={containerComponent.components.length}
                onAddComponent={onAddComponent}
                allowContainerComponent={false}
                largeButton={false}
                className="icon"
            />
        </div>
    )
}