import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import Component from "~/components/portfolioComponents/Component";
import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {IconEdit, IconMenu2, IconTrash} from "@tabler/icons-react";
import {ActionIcon, Button} from "@mantine/core";
import {useState} from "react";

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

    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="containerComponents" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}
                             style={{display: 'flex', flexDirection: 'row'}}>
                            {containerState.components.map((component: ComponentType, index: number) => (
                                <Draggable key={component._id} draggableId={component._id} index={index}>
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
                                            <ActionIcon color="red" className="icon">
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
            <Button className="containerComponent icon">Add</Button>
        </div>
    )
}