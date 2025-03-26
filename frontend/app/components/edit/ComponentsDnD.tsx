import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import Component from "~/components/portfolioComponents/Component";
import type {ComponentType} from "../../../../common/interfaces/interfaces";
import type Portfolio from "../../../../common/interfaces/portfolio";


interface Props {
    onSelectEditComponent: (component: ComponentType) => void;
    portfolioState: Portfolio;
    setPortfolioState: (portfolio: Portfolio) => void;
    onDragEnd: (result: DropResult) => void;
}

export default function ComponentsDnD({onSelectEditComponent, portfolioState, setPortfolioState, onDragEnd}: Props) {

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
                                        onClick={() => onSelectEditComponent(component)}
                                    >
                                        <Component component={component}/>
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