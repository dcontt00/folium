import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import EditComponent from "~/components/portfolioComponents/EditComponent";
import type {ComponentType} from "~/interfaces/interfaces";
import type Portfolio from "~/interfaces/portfolio";
import {IconEdit, IconMenu2, IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import type StyleClass from "~/interfaces/styleClass";
import type Style from "~/interfaces/style";


interface Props {
    onSelectEditComponent: (component: ComponentType) => void;
    portfolioState: Portfolio;
    onDragEnd: (result: DropResult) => void;
    onRemoveComponent: (component: ComponentType) => void;
    onEditComponent: (component: ComponentType) => void;
    onStyleClassAdd: (styleClass: StyleClass) => void;
    style: Style
}

export default function ComponentsDnD({
                                          onSelectEditComponent,
                                          portfolioState,
                                          onDragEnd,
                                          onRemoveComponent,
                                          onEditComponent,
                                          onStyleClassAdd,
                                          style
                                      }: Props) {

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="components">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="dnd-droppable"
                         style={{alignItems: style.classes["container"].alignItems}}>
                        {portfolioState.components.map((component, index) => (
                            <Draggable key={component._id} draggableId={component.componentId.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="dnd-draggable"
                                    >
                                        <div {...provided.dragHandleProps}>
                                            <IconMenu2 className="icon"/>
                                        </div>
                                        <EditComponent
                                            component={component}
                                            onSelectEditComponent={onSelectEditComponent}
                                            onEditComponent={onEditComponent}
                                            styleClass={portfolioState.style.classes?.[component.className]}
                                            onStyleClassAdd={onStyleClassAdd}
                                            style={style}
                                        />

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