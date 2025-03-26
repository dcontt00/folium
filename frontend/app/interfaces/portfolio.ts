import type Component from "./component"

export default interface Portfolio {
    _id: string;
    title: string;
    description: string;
    url: string;
    components: Component[];
}