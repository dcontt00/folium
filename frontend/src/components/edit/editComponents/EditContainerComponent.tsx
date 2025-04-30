import type {ComponentType, ContainerComponentType} from "~/interfaces/interfaces"
import EditComponent from "~/components/portfolioComponents/EditComponent";
import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {IconEdit, IconMenu2, IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import {useState} from "react";
import AddComponentMenu from "~/components/edit/AddComponentMenu";
import type StyleClass from "~/interfaces/styleClass";
import type Style from "~/interfaces/style";

interface Props {
    containerComponent: ContainerComponentType,
    onEditComponent: (component: ComponentType) => void;
    onSelectEditComponent: (component: ComponentType) => void;
    onStyleClassAdd: (styleClass: StyleClass) => void,
    style: Style
}

export default function EditContainerComponent({
                                                   containerComponent,
                                                   onEditComponent,
                                                   onSelectEditComponent,
                                                   onStyleClassAdd,
                                                   style
                                               }: Props) {

    const [containerState, setContainerState] = useState(containerComponent);
    const styleClass = style.classes[containerComponent.className]
    console.log("editConta", styleClass)

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
        <div style={{
            display: 'flex',
            justifyContent: "space-between",
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            width: '100%',
        }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="containerComponents" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}
                             style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
                            {containerState.components.map((component: ComponentType, index: number) => (
                                <Draggable key={component.componentId} draggableId={index.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="dnd-container"
                                        >
                                            <div {...provided.dragHandleProps} className="container-icon">
                                                <IconMenu2/>
                                            </div>

                                            <EditComponent component={component}
                                                           onEditComponent={onEditComponent}
                                                           onSelectEditComponent={onSelectEditComponent}
                                                           onStyleClassAdd={onStyleClassAdd}
                                                           styleClass={style.classes[component.className]}
                                                           style={style}
                                            />
                                            <ActionIcon className="container-icon"
                                                        onClick={() => onSelectEditComponent(component)}>
                                                <IconEdit/>
                                            </ActionIcon>
                                            <ActionIcon color="red" className="container-icon"
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
                parent_id={containerComponent.parent_id}
                portfolioComponentsLength={containerComponent.components.length}
                onAddComponent={onAddComponent}
                allowContainerComponent={false}
                onStyleClassAdd={onStyleClassAdd}
            />
        </div>
    )
}