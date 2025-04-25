import type Component from "./component"
import type Style from "~/interfaces/style";

export default interface Portfolio {
    _id: string;
    title: string;
    description: string;
    url: string;
    components: Component[];
    style: Style;
}