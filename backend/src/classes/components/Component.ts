import IComponentClass from "@/interfaces/IComponentClass";

export default class Component implements IComponentClass {
    _id: string;
    __t: string;
    componentId: number;
    index: number;
    parent_id: string;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string) {
        this._id = _id;
        this.__t = __t;
        this.componentId = componentId;
        this.index = index;
        this.parent_id = parent_id;
    }

    toHtml(): string {
        return `<div></div>`;
    }

}