import Component from "@/classes/components/Component";

export default class ContainerComponent extends Component {
    components: any[];

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, components: any[]) {
        super(_id, __t, componentId, index, parent_id, className);
        this.components = components;

    }

    toHtml() {
        return `
         <div
            style={{display: 'flex', flexDirection: 'row', gap: "1em"}}>
            {this.components.map((component: ComponentType, index: number) => (
                <div
                    className="containerComponent"
                >
                    {component.toHtml()}
                </div>
            ))}
        </div>
        
        `;
    }
}