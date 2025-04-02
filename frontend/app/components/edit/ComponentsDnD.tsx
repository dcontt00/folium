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
    onEditComponent: (component: ComponentType) => void;
}

export default function ComponentsDnD({
                                          onSelectEditComponent,
                                          portfolioState,
                                          onDragEnd,
                                          onRemoveComponent,
                                          onEditComponent
                                      }: Props) {

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="components">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="container">
                        {portfolioState.components.map((component, index) => (
                            <Draggable key={component._id} draggableId={index.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="edit"
                                    >
                                        <div {...provided.dragHandleProps}>
                                            <IconMenu2 className="icon"/>
                                        </div>
                                        <Component component={component} onSelectEditComponent={onSelectEditComponent}
                                                   onEditComponent={onEditComponent}/>

                                        {component.__t != "ContainerComponent" && (

                                            <ActionIcon className="icon"
                                                        onClick={() => onSelectEditComponent(component)}>
                                                <IconEdit/>
                                            </ActionIcon>
                                        )}
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