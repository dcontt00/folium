import Component from "@/classes/components/Component";
import Change from "@/classes/Change";

interface ComponentChanges {
    component: Component,
    changes: Change[]
}

export default class Changes {
    componentChanges: Map<Component, Change[]>
    portfolioChanges: Change[]
    componentAdditions: Component[]
    componentRemovals: Component[]
    portfolioCreated: boolean


    constructor() {
        this.componentChanges = new Map<Component, Change[]>();
        this.portfolioChanges = [];
        this.componentAdditions = [];
        this.componentRemovals = [];
        this.portfolioCreated = false;
    }

    setPortfolioCreated(value: boolean) {
        this.portfolioCreated = value;
    }

    addComponentChange(component: Component, attribute: string, oldValue: string, newValue: string) {
        const change = new Change(attribute, oldValue, newValue);
        if (this.componentChanges.has(component)) {
            this.componentChanges.get(component)?.push(change);
        } else {
            this.componentChanges.set(component, [change]);
        }
        console.log(this.componentChanges);
    }

    addPortfolioChange(attribute: string, oldValue: string, newValue: string) {
        const change = new Change(attribute, oldValue, newValue);
        this.portfolioChanges.push(change);
    }

    removeComponent(component: Component) {
        this.componentRemovals.push(component);
    }

    addComponent(component: Component) {
        this.componentAdditions.push(component);
    }

    toString(): string {
        let output = ""

        if (this.componentAdditions.length > 0) {
            output += `Added Components: ${this.componentAdditions.map(component => component.toString()).join(", ")}`
        }

        if (this.portfolioChanges.length > 0) {
            output += `Portfolio Changes: ${this.portfolioChanges.map(change => change.toString()).join(", ")}`
        }

        if (this.componentChanges.size > 0) {
            output += `Component Changes: `
            this.componentChanges.forEach((changes, component) => {
                output += `${component.__t}, Changes: ${changes.map(change => change.toString()).join(", ")}`
            });
        }

        if (this.componentRemovals.length > 0) {
            output += `Removed Components: ${this.componentRemovals.map(component => component.toString()).join(", ")}`
        }


        return output;
    }

    toJSON() {
        let componentChanges: ComponentChanges[] = []
        let portfolioChanges: string | null = null
        let componentAdditions: string | null = null
        let componentRemovals: string | null = null
        let portfolioCreated: boolean = this.portfolioCreated

        if (this.componentAdditions.length > 0) {
            componentAdditions = `${this.componentAdditions.map(component => component.__t).join(", ")}`
        }

        if (this.portfolioChanges.length > 0) {
            portfolioChanges = `${this.portfolioChanges.map(change => change.toString()).join(", ")}`
        }

        if (this.componentChanges.size > 0) {


            this.componentChanges.forEach((changes, component) => {
                componentChanges.push({component: component, changes: changes});
            });
        }

        if (this.componentRemovals.length > 0) {
            componentRemovals = `${this.componentRemovals.map(component => component.toString()).join(", ")}`
        }

        return {
            componentChanges: componentChanges,
            portfolioChanges: portfolioChanges,
            componentAdditions: componentAdditions,
            componentRemovals: componentRemovals,
            portfolioCreated: portfolioCreated
        }
    }


}