import type StyleClass from "~/interfaces/styleClass";

export default interface Style {
    _id: string;
    classes: Map<string, StyleClass>
}