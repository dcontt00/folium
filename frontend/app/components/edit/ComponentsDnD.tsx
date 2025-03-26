import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import Component from "~/components/portfolioComponents/Component";
import type {ComponentType} from "~/interfaces/interfaces";
import type Portfolio from "~/interfaces/portfolio";
import {IconEdit, IconMenu2, IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";


interface Props {
    onSelectEditComponent: (component: ComponentType) => void;
    portfolioState: Portfolio;
    onDragEnd: (result: DropResult) => void;
    onRemoveComponent: (component: ComponentType) => void;
}

export default function ComponentsDnD({onSelectEditComponent, portfolioState, onDragEnd, onRemoveComponent}: Props) {

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="components">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {portfolioState.components.map((component, index) => (
                            <Draggable key={component._id} draggableId={component._id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="edit"
                                    >
                                        <IconMenu2 className="icon"/>
                                        <Component component={component}/>
                                        <ActionIcon className="icon" onClick={() => onSelectEditComponent(component)}>
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
    )
}