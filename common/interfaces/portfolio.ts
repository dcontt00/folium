import type Component from "./component"

export default interface Portfolio {
    title: string;
    description: string;
    url: string;
    components: Component[];
}