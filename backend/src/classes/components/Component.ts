import IComponentClass from "@/interfaces/IComponentClass";

export default class Component implements IComponentClass {
    _id: string;
    __t: string;
    componentId: number;
    index: number;
    parent_id: string;
    className: string;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string) {
        this._id = _id;
        this.__t = __t;
        this.componentId = componentId;
        this.index = index;
        this.parent_id = parent_id;
        this.className = className;
    }

    toHtml(): string {
        return `<div></div>`;
    }

}