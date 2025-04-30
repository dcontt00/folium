import Component from "@/classes/components/Component";

export default class ContainerComponent extends Component {
    components: any[];

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, components: any[]) {
        super(_id, __t, componentId, index, parent_id, className);
        this.components = components;

    }

    toHtml() {
        const componentsHtml = this.components.map((component: Component) => {
            return component.toHtml();
        })
        console.log(componentsHtml);


        return `
         <div
            style="display: flex; flexDirection: row; gap: 1em">
            ${componentsHtml.join('\n')}
        </div>
        
        `;
    }
}